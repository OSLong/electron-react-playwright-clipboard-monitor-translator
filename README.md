# Electron Playwright JP -> CN Clipboard Monitor Translator

## NOTE :
---
The Author is lazy , Currently this app is match with author requirement ready 
So If you have any issue or update , 
you can fork it and update yourself

# NOTE 2 :
---
This Project is nothing new idea , just 
- Electron
- React
- Playwright

The thing i thing new way is just using playwright to simulate browser to translate free
So we no need to do hard reverse engine ,

Pros : 
- It can very easy to implement yourself

Cons : 
- For Batch Request , not support 

# NOTE 3
---
For me , i think optimize , can use mobile version of translate page more minify and load faster 
But i lazy to implement too 

# NOTE 4 :
---
Currently bug is 
- use 'electron-builder' build dist and run on Linux AppImage , we cannot close it , not know why too 
For Closing it 
```sh
pkill playwright-clipboard
```

- For Built Window , cannot open , it show white screen

# Getting Started 
===
```sh
npm install
npm run build
```
then theoritically , you will see 'dist' folder you root project