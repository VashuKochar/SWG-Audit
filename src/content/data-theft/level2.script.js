(function () {
  var SAMPLES = { dlp: { label: 'DLP test (card + SSN)', filename: 'sample-dlp-test.txt', content: 'Card 4111-1111-1111-1111. SSN 123-45-6789 (fake).' } };
  var form = document.getElementById('upload-form');
  var fileChoice = document.getElementById('file-choice');
  var currentFileBlock = document.getElementById('current-file-block');
  var currentFileNameEl = document.getElementById('current-file-name');
  var currentFileSizeEl = document.getElementById('current-file-size');
  var uploadArea = document.getElementById('upload-area');
  var fileInput = document.getElementById('file');
  var fileNameInput = document.getElementById('file-name');
  var changeFileBtn = document.getElementById('change-file');
  var resultBlock = document.getElementById('upload-result-block');
  var resultHeading = document.getElementById('upload-result-heading');
  var resultMessage = document.getElementById('upload-result-message');
  var resultUrlWrap = document.getElementById('upload-result-url-wrap');
  var resultDeleteMsg = document.getElementById('upload-result-delete-msg');
  var uploadTimer = document.getElementById('upload-timer');
  var resetTestBtn = document.getElementById('reset-test-btn');
  var currentFile = null;
  var countdownInterval = null;

  if (!form) return;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, sizes = ['B', 'KB', 'MB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function setCurrentSample(id) {
    var sample = SAMPLES[id];
    if (!sample) return;
    currentFile = { type: 'sample', id: id };
    fileChoice.hidden = true;
    currentFileBlock.hidden = false;
    currentFileNameEl.textContent = sample.label;
    currentFileSizeEl.textContent = '';
    fileNameInput.value = sample.filename;
  }
  function setCurrentOwnFile(file) {
    currentFile = { type: 'own', file: file };
    fileChoice.hidden = true;
    currentFileBlock.hidden = false;
    currentFileNameEl.textContent = file.name;
    currentFileSizeEl.textContent = ' (' + formatBytes(file.size) + ')';
    fileNameInput.value = file.name;
  }
  function clearCurrentFile() {
    currentFile = null;
    fileInput.value = '';
    fileNameInput.value = '';
    fileChoice.hidden = false;
    currentFileBlock.hidden = true;
  }
  function showResult(options) {
    var isFailure = options.isFailure, message = options.message, fileUrl = options.fileUrl || '', showTimer = options.showTimer === true;
    form.hidden = true;
    resultBlock.hidden = false;
    resultHeading.textContent = isFailure ? 'Your Perimeter Security Failed' : 'Upload blocked or failed';
    resultHeading.className = isFailure ? 'error' : 'success';
    resultMessage.textContent = message;
    resultMessage.className = isFailure ? 'error' : 'success';
    resultUrlWrap.hidden = !fileUrl;
    if (fileUrl) resultUrlWrap.innerHTML = 'File successfully uploaded. <a href="' + fileUrl + '" target="_blank" rel="noopener">Visit file URL</a>';
    resultDeleteMsg.hidden = !showTimer;
    if (showTimer) {
      var timeLeft = 600;
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(function () {
        var m = Math.floor(timeLeft / 60), s = timeLeft % 60;
        uploadTimer.textContent = m + ':' + (s < 10 ? '0' : '') + s;
        if (timeLeft <= 0) { clearInterval(countdownInterval); countdownInterval = null; }
        timeLeft--;
      }, 1000);
    } else if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
  }
  function resetTest() {
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    resultBlock.hidden = true;
    form.hidden = false;
    clearCurrentFile();
  }
  document.getElementById('sample-dlp').addEventListener('click', function () { setCurrentSample('dlp'); });
  uploadArea.addEventListener('click', function (e) { if (e.target !== fileInput) fileInput.click(); });
  uploadArea.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  uploadArea.addEventListener('dragover', function (e) { e.preventDefault(); uploadArea.classList.add('data-theft-dragover'); });
  uploadArea.addEventListener('dragleave', function () { uploadArea.classList.remove('data-theft-dragover'); });
  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('data-theft-dragover');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) {
      var file = files[0];
      if (file.size > 1024) { resultBlock.hidden = false; form.hidden = true; showResult({ isFailure: false, message: 'File size exceeds 1 KB. Choose a smaller file.', showTimer: false }); return; }
      fileInput.files = files;
      setCurrentOwnFile(file);
    }
  });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (file) {
      if (file.size > 1024) { resultBlock.hidden = false; form.hidden = true; showResult({ isFailure: false, message: 'File size exceeds 1 KB. Choose a smaller file.', showTimer: false }); return; }
      setCurrentOwnFile(file);
    }
  });
  changeFileBtn.addEventListener('click', clearCurrentFile);
  resetTestBtn.addEventListener('click', resetTest);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!currentFile) { showResult({ isFailure: false, message: 'Choose a sample or upload a file.', showTimer: false }); form.hidden = true; resultBlock.hidden = false; return; }
    var displayName = (fileNameInput.value && fileNameInput.value.trim()) || null;
    var fd = new FormData();
    var fileToSend;
    if (currentFile.type === 'sample') {
      var sample = SAMPLES[currentFile.id];
      fileToSend = new File([sample.content], displayName || sample.filename, { type: 'text/plain' });
    } else {
      var f = currentFile.file;
      fileToSend = displayName ? new File([f], displayName, { type: f.type }) : f;
    }
    fd.append('file', fileToSend);
    fetch('/data-theft/upload', { method: 'POST', body: fd })
      .then(function (r) {
        return r.json().then(function (data) {
          if (r.ok) {
            var fullUrl = data.url ? (window.location.origin + data.url) : '';
            showResult({ isFailure: true, message: 'File upload to the server should have been blocked. Review SWG or DLP logs for this upload.', fileUrl: fullUrl, showTimer: true });
          } else {
            var msg = data.error || 'Perimeter may have passed.';
            if (r.status === 413 || (data.error && data.error.indexOf('size') !== -1)) msg = 'File too large. Maximum size is 1 KB.';
            else if (data.error && data.error.indexOf('Max uploads') !== -1) msg = 'Upload limit reached for this session (max 5). Go to the home page and verify again to start a new session.';
            showResult({ isFailure: false, message: msg, showTimer: false });
          }
        }, function () {
          if (r.status === 413) showResult({ isFailure: false, message: 'File too large. Maximum size is 1 KB.', showTimer: false });
          else showResult({ isFailure: false, message: 'Request failed or blocked. Perimeter may have passed.', showTimer: false });
        });
      })
      .catch(function () { showResult({ isFailure: false, message: 'Request failed or blocked. Perimeter may have passed.', showTimer: false }); });
  });
})();
