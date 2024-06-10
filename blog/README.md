<!-- PROJECT INTRODUCTION -->
<br />
<p align="center">
  <h3 align="center">Blog Microservice</h3>

  <p align="center">
    A simple fullstack microservice blog utilizing JavaScript, Docker, and Kubernetes.
    <br />
    IMPORTANT NOTE: This application does not have autoreload functionality. When you add a post or comment you WILL need to refresh the page to view your post/comment.
    <br />
  </p>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- ABOUT THE PROJECT -->
## About The Project

![Blog Screenshot](https://i.imgur.com/jfAgxYP.png)<br />
Project Link: [Blog](http://34.135.47.250/)


### Built With

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.<br />
Note the word 'orange' is blocked by the moderation service and will return a warning stating 'This comment has been rejected.'

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Fikcup/react-portfolio.git
   ```
2. Edit the host in ingress-srv.yaml to reflect a local IP
3. Install ingress-nginx to your cluser
   ```sh
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/cloud/deploy.yaml
   ```
4. Apply k8s yaml files
   ```sh
   cd infra/k8s
   kubectl apply -f .
   ```
5. Open the specified host in your browser

<!-- LICENSE -->
## License
MIT License

Copyright (c) 2022 Rhys Wright

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<!-- CONTACT -->
## Contact

Rhys Wright - [LinkedIn](https://www.linkedin.com/in/rhys-wright/) - rhys.n.wright@gmail.com