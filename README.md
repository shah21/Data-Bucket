![Contributors][contributors-shield]
![Froks][Forks-sheild]
![Issues][Issues-sheild]
![Licence][Licence-sheild]

  
 </br>
 <p align="center">
  <h3 align="center" >DATA BUCKET 🗃️</h3>
 <p align="center">
  An awesome  Mini drop box with minimalistic features
  <br />
  <a href="https://github.com/shah21/Data-Bucket/">View Demo</a>
  ·
  <a href="https://github.com/shah21/Data-Bucket/issues">Report Bug</a>
  ·
  <a href="https://github.com/shah21/Data-Bucket/issues">Request Feature</a>
 </p>
 </p>

<!-- TABLE OF CONTENTS -->
#
<details open="open">
  <summary>Table of Contents </summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
<!--     <li><a href="#usage">Usage</a></li> -->
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project  🚀

[![main-shot][product-screenshot]](https://example.com)

There are many so many great data sharing platforms available on internet, however, I didn't find one that really suit my needs so I created this enhanced one. I want to create a fast and scalable data bucket for sharing data between devices of a single user. This repo contains web and server part. Apps for other platforms will be coming soon...

Here's why:
* You can share data fastly and fetch from anywhere 
* Data bucket means any kind of data text and file
* If you are frustrated about manually copying data between devices, this is for you 

Of course, no one project serve all features since your needs may be different. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue. Thanks to all the people have have contributed to expanding this project!


### Built With

![react][react-url]
![typescript][types-url]
![node][npm-image]
![mongodb][mongo-url]


<!-- GETTING STARTED -->
## Getting Started

To run and rebuild project locally in any enviroment you want these things 👇

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

<h4> Backend </h4>

1. Configure aws and Get API keys 📖 [Working with s3 bucket][s3bucket-docs] , [Get aws credentials][awsCred-url]
2. Configure mongoDb database 📖 [Connect with mongoDb atlas][mongo-conn]
3. Clone the repo

   ```sh
   git clone https://github.com/shah21/Data-Bucket.git
   ```
3. Install NPM packages

   ```sh
   npm install
   ```
4. Enter your API keys and Database credentials in .env 
   🗒️ You can find example .env file from repo
   
   ```JS
    API_KEY = ENTER YOUR API
    DB_USER = USER_NAME
    etc...
   ```
<h4> Frontend </h4> 

1. Install NPM packages

   ```sh
   npm install
   ```
2. Change host ( server address ) on axios/config.ts ( if you want to run project locally )

   ```sh
   const host = window.location.host;
   const BASE_URL = `http://${host}`;
   ```   


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/shah21/Data-Bucket.git/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Data-Bucket is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

📖 [Learn more about open source contribution][opensource-docs]

<!-- LICENSE -->
## License

Distributed under the Apache License 2.0 License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Muhsin Shah - [@shah21](https://twitter.com/MuhsinS07857838?s=09) - muhsinshah21@gmail.com

Project Link: [https://github.com/shah21/Data-Bucket.git](https://github.com/shah21/Data-Bucket.git/i)





img[src*='#left'] {
    float: left;
}
img[src*='#right'] {
    float: right;
}
img[src*='#center'] {
    display: block;
    margin: auto;
}





<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/shah21/data-bucket?style=for-the-badge&logo=github#center
[Forks-sheild]: https://img.shields.io/github/forks/shah21/data-bucket?logo=git&style=for-the-badge
[Issues-sheild]:https://img.shields.io/github/issues/shah21/data-bucket?logo=Bitrise&style=for-the-badge
[Licence-sheild]: https://img.shields.io/github/license/shah21/data-bucket?style=for-the-badge
[product-screenshot]: screenshots/sc1.PNG

[node-js]: https://img.shields.io/badge/node-javascript-green
[npm-image]: https://img.shields.io/badge/node-v12.18.3-green
[mongo-url]: https://img.shields.io/badge/mongodb-v4.4-brightgreen
[react-url]: https://img.shields.io/badge/reactJs-%20v17.0.1-blue
[types-url]: https://img.shields.io/badge/typescript-4.1.5-%236E97CC

[s3bucket-docs]: https://docs.aws.amazon.com/AmazonS3/latest/dev-retired/UsingBucket.html
[awsCred-url]: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
[mongo-conn]: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
[opensource-docs]: https://opensource.guide/how-to-contribute/
