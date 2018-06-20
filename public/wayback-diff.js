function LoadWaybackDiff() {
  // import('../build/app.js');
  var script = document.createElement('script');
  script.src = `/build/app.js`;

  document.head.appendChild(script);
}