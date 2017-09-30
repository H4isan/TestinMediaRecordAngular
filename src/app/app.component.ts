import { Component, OnInit, ElementRef } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
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

  constructor(private sanitizer:  DomSanitizer, private element: ElementRef) {
  }

  ngOnInit() {
}

  public showCam() {
    // 1. Casting necessary because TypeScript doesn't
    // know object Type 'navigator';
    const nav = <any>navigator;
    // 2. Adjust for all browsers
    nav.getUserMedia = (nav.getUserMedia ||
      nav.webkitGetUserMedia ||
      nav.mozGetUserMedia ||
      nav.msGetUserMedia);
    const constraints = { 'video': { width: { max: 320 } }, 'audio' : true };
    // OR: http://stackoverflow.com/questions/32645724/angular2-cant-set-video-src-from-navigator-getusermedia for credits
    const promise = new Promise<string>((resolve, reject) => {
          nav.getUserMedia( constraints, (stream) => {
              resolve(stream);
          }, (err) => reject(err));

      }).then((stream) => {
          const webcamUrl = URL.createObjectURL(stream);
          this.videosrc = this.sanitizer.bypassSecurityTrustResourceUrl(webcamUrl);
          const videoRecord = this.element.nativeElement.querySelector('video');
          console.log(videoRecord.readyState);
          videoRecord.srcObject = stream;
          setTimeout(() => {          videoRecord.play();
          }, 2000);
          const recorder = new MediaRecorder(stream);
          // will be called each time we get data from stream.
          recorder.ondataavailable = this.onDataAvailable;
          recorder.start();
          // for example: type logic here to send stream to your  server and (re)distribute to
          // other connected clients.
      }).catch((error) => {
          console.log(error);
      });

  }
  onDataAvailable(e) {
    if (e.data) {
      this.buffer.push(e.data);
      console.log(e.data);
    }
  }
  bufferToDataUrl(callback) {
    const blob = new Blob(this.buffer, {
      type: 'video/webm'
    });
    const reader = new FileReader();
    reader.onload = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(blob);
  }
// returns file, that we can send to the server.
  dataUrlToFile(dataUrl) {
  const binary = atob(dataUrl.split(',')[1]),
  data = [];

  for (let i = 0; i < binary.length; i++) {
    data.push(binary.charCodeAt(i));
  }

  return new File([new Uint8Array(data)], 'recorded-video.webm', {
    type: 'video/webm'
  });
}
// triggered by user.
   /*onStopButtonClick() {
  try {
    recorder.stop();
    recorder.stream.getTracks().forEach(function(track)       {track.stop();});
  } catch (e) {}

 bufferToDataUrl(function(dataUrl) {
    var file = dataUrlToFile(dataUrl);
    console.log(file);
    // upload file to the server.
  });
}*/
}
