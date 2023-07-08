var loadPending = true;
function loadCheck() {
  if ( loadPending
    && defaultFont.isReady()
    && iconFont.isReady()
    && dotMatrixFont.isReady()
  ) { loadPending = false; main(); }
}

window.onload = function () {
