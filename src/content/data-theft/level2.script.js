// Load shared result helper
(function() {
  var helperScript = document.createElement('script');
  helperScript.src = '/js/shared/result-helper.js';
  helperScript.onload = function() {
    initUploadTest();
  };
  document.head.appendChild(helperScript);
})();

function initUploadTest() {
  var SAMPLES = { 
    dlp: { 
      label: 'DLP test (card + SSN)', 
      filename: 'dlp-test.txt', 
      content: 'Test credit card: 4111-1111-1111-1111\nTest SSN: 123-45-6789\nThis file contains sensitive data patterns for DLP testing.' 
    } 
  };
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
    fileChoice.hidden = false;
    currentFileBlock.hidden = true;
  }

  function showUploadResult(success, message, url) {
    resultBlock.hidden = false;
    if (success) {
      resultHeading.textContent = 'Upload succeeded';
      resultMessage.textContent = message;
      // Upload succeeded = FAIL
      showResult('fail');
      if (url) {
        resultUrlWrap.innerHTML = '<strong>File URL:</strong> <a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>';
        resultUrlWrap.hidden = false;
        resultDeleteMsg.hidden = false;
        startCountdown();
      }
    } else {
      resultHeading.textContent = 'Upload failed';
      resultMessage.textContent = message;
      // Upload failed/blocked = PASS
      showResult('pass');
    }
  }

  function startCountdown() {
    var seconds = 600; // 10 minutes
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(function() {
      seconds--;
      if (seconds <= 0) {
        clearInterval(countdownInterval);
        uploadTimer.textContent = '0:00 (deleted)';
        return;
      }
      var mins = Math.floor(seconds / 60);
      var secs = seconds % 60;
      uploadTimer.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
  }

  function resetTest() {
    clearCurrentFile();
    resultBlock.hidden = true;
    hideResults();
    if (countdownInterval) clearInterval(countdownInterval);
  }

  // Sample button
  document.getElementById('sample-dlp').addEventListener('click', function() {
    setCurrentSample('dlp');
  });

  // Change file button
  changeFileBtn.addEventListener('click', clearCurrentFile);

  // File input change
  fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
      setCurrentOwnFile(fileInput.files[0]);
    }
  });

  // Drag and drop
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });

  uploadArea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('data-theft-dragover');
  });

  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('data-theft-dragover');
  });

  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('data-theft-dragover');
    if (e.dataTransfer.files.length > 0) {
      setCurrentOwnFile(e.dataTransfer.files[0]);
    }
  });

  // Form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    hideResults();
    resultBlock.hidden = true;

    if (!currentFile) {
      showUploadResult(false, 'No file selected.', null);
      return;
    }

    var formData = new FormData();
    var filename = fileNameInput.value || 'file';

    if (currentFile.type === 'sample') {
      var sample = SAMPLES[currentFile.id];
      var blob = new Blob([sample.content], { type: 'text/plain' });
      formData.append('file', blob, filename);
    } else {
      formData.append('file', currentFile.file, filename);
    }

    fetch('/data-theft/upload', {
      method: 'POST',
      body: formData
    })
      .then(function(r) {
        if (!r.ok) {
          return r.json().then(function(data) {
            throw new Error(data.error || 'Upload failed');
          }).catch(function() {
            throw new Error('Upload failed (HTTP ' + r.status + ')');
          });
        }
        return r.json();
      })
      .then(function(data) {
        showUploadResult(true, data.message || 'File uploaded successfully.', data.url);
      })
      .catch(function(err) {
        showUploadResult(false, err.message || 'Upload blocked or network error.', null);
      });
  });

  // Reset button
  resetTestBtn.addEventListener('click', resetTest);
}
