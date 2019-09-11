class VideoNode {
  constructor({index, title, assetRoot, withInit = false}) {
    this.index = index;
    this.title = title;
    this.assetRoot = assetRoot;
    if (withInit) {
      this.init();
    }
  }

  init() {
    if (this.fetchTask) {
      return this.fetchTask;
    }
    this.fetchTask = Promise.all([
      fetchAB(`${this.assetRoot}${this.index}.mp4`),
      fetch(`/api/nodes/${this.index}`),
    ]).then(responses => {
      const nodeData = responses[1];
      const {children, endChoice, startChoice} = nodeData;
      this.buf = responses[0];
      this.startChoice = startChoice;
      this.endChoice = endChoice;
      this.children = children.map(
        ({index, title}) => new VideoNode({index, title, assetRoot: this.assetRoot})
      );
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

function fetch (url) {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.send();
  });
}
