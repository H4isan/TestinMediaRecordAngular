import { Component, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
declare var MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public videosrc: any;
  buffer = [];
  theRecorder;
  theStream;
  constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
  }

  ngOnInit() {
  }


  showCamMobile() {
    const nav = <any>navigator;
    if (nav.mediaDevices === undefined) {
      nav.mediaDevices = {};
    }
    if (nav.mediaDevices.getUserMedia === undefined) {
      nav.mediaDevices.getUserMedia = (constraints) => {
        // First get ahold of the legacy getUserMedia, if present
        const getUserMedia = nav.webkitGetUserMedia || nav.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const video = this.element.nativeElement.querySelector('video');
        // Older browsers may not have srcObject
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch((err) => {
        console.log(err.name + ': ' + err.message);
      });
  }

  public showCam() {
    const nav = <any>navigator;
    nav.getWebcam = (nav.getUserMedia ||
      nav.webkitGetUserMedia ||
      nav.mozGetUserMedia ||
      nav.msGetUserMedia);
    const promise = new Promise<string>((resolve, reject) => {
      nav.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true }, (stream) => {
        resolve(stream);
      }, (err) => reject(err));
    }).then((mediaStream) => {
      const video = this.element.nativeElement.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    });

  }
  gotMedia(stream) {
    this.theStream = stream;
    const video = this.element.nativeElement.querySelector('video');
    video.srcObject = (stream);
    try {
      video.play();
      this.theRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      this.theRecorder.ondataavailable =
        (event) => { this.buffer.push(event.data); };
      this.theRecorder.start(100);
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      return;
    }

  }
  download() {
    this.theRecorder.stop();
    this.theStream.getTracks().forEach(track => { track.stop(); });
    const blob = new Blob(this.buffer, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    // setTimeout() here is needed for Firefox.
    this.playdeoVideo();

    // URL.revokeObjectURL(url);

  }
  playdeoVideo() {
    const superBuffer = new Blob(this.buffer);
    const video = this.element.nativeElement.querySelector('video');
    video.src =
      window.URL.createObjectURL(superBuffer);
    video.play();
  }
}
