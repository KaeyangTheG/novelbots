class VideoNode {
  constructor({
    index, title,
    children,
    endChoice,
    startChoice,
    assetRoot,
    duration,
    withInit = false,
  }) {
    this.index = index;
    this.title = title;
    this.children = children;
    this.endChoice = endChoice;
    this.startChoice = startChoice;
    this.assetRoot = assetRoot;
    this.duration = duration;
    if (withInit) {
      this.init();
    }
  }

  init() {
    if (this.fetchTask) {
      return this.fetchTask;
    }

    this.fetchTask =
      fetchAB(`${this.assetRoot}${this.index}.mp4`)
        .then(buf => {
          this.buf = buf 
        });

    return this.fetchTask;
  }
}

export default VideoNode;

function fetchAB (url) {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.send();
  });
}

