# AngularTestComponents

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


        // 3. Trigger lifecycle tick (ugly, but works - see (better) Promise example below)
        // setTimeout(() => { }, 100);
        setTimeout(() => {}, 2000);
        // 4. Get stream from webcam
        nav.getUserMedia(
          {video: true, audio: true},
          (stream) => {
              const webcamUrl = stream;

              // 4a. Tell Angular the stream comes from a trusted source
              this.videosrc = this.sanitizer.bypassSecurityTrustUrl(webcamUrl);

              // 4b. Start video element to stream automatically from webcam.
              const videoRecord = this.element.nativeElement.querySelector('video');
              videoRecord.srcObject = stream;

              if (typeof videoRecord.srcObject === 'object') {
                videoRecord.srcObject = stream;
              } else {
                videoRecord.src = stream;
              }
              videoRecord.onloadedmetadata = function(e) {
                // Do something with the video here.
                videoRecord.play();
                console.log(e);
              };
          },
          (err) => console.log(err));

