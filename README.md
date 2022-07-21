
# Log Conversion Script - cdn2agora
#### A Node.js script that converts MINHA CDN logs to Agora logs format

The purpose of this project is a simple way to convert MINHA CDN's Log to Agora's Log Format
  
 ## User Guide
 Basic usage example:
```
npx cdn2agora <inputUrl> <outputPath> [--overwriteFile]
 ```
### Arguments
 
| Name | Alias | Index | Description |
|--|--|--|--|
| inputUrl | -i | 1 | MINHA CDN logs url to fetch |
| outputPath | -o | 2 | Output Path to save Agora logs |
| overwriteFile | -v  | - | *Optional:* Overwrite file if it already exists |

#### Examples:

Simple usage:
```
npx cdn2agora http://logstorage.com/minhaCdn1.txt ./output/minhaCdn1.txt
 ```
Alternative usage:
```
npx cdn2agora --inputUrl=https://s3.amazonaws.com/uux-itaas-static/minha-cdn-logs/input-01.txt --outputPath=./output/minhaCdn1.txt --overwriteFile
 ```
 Alternative usage with alias:
```
npx cdn2agora -i=https://s3.amazonaws.com/uux-itaas-static/minha-cdn-logs/input-01.txt -o=./output/minhaCdn1.txt -v
 ```
### Author

---

<a href="https://github.com/AllanLancioni">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/29322473?v=4?s=460&u=61b426b901b8fe02e12019b1fdb67bf0072d4f00&v=4" width="100px" alt=""/>
 <br />
 <sub><b>Allan Lancioni</b></sub></a>

[![Linkedin Badge](https://img.shields.io/badge/-Allan%20Lancioni-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/allanlancioni/)](https://www.linkedin.com/in/allanlancioni/) [![Gmail Badge](https://img.shields.io/badge/-aclancioni@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:aclancioni@gmail.com)](mailto:aclancioni@gmail.com)