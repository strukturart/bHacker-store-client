![logo](/images/logo.png)

## bHacker-store

An alternative app store by free developers for free devices.
The database of apps is hosted [here](https://gitlab.com/banana-hackers/store-db/-/tree/master), further can be added by a pull request.

### Features

- Install apps from the coders source

![image-1](/images/image-1.png)
![image-2](/images/image-2.png)
![image-3](/images/image-3.png)
![image-4](/images/image-4.png)

### How to sideload the app on your device

## Omni SD

Download [bHackerStore App](https://github.com/strukturart/kaiOs-alt-app-store/releases/download/0.5/bhacker-store.zip).
Copy this zip file to the apps directory of the memory card.
Open "OmniSD" and install this zip.

## Web IDE

Download [bHackerStore App](https://github.com/strukturart/kaiOs-alt-app-store/releases/download/0.5/bhacker-store.zip).
Extract this zip to a folder.
Click "Open Packaged App" and select the folder from the previous step.
Click "Install and Run" button.

### Thank you

- SimonLaux and the discord [community](https://discord.gg/t2CBPb)

### to do

offline version

## Donation

<a href="https://www.buymeacoffee.com/vj6Q8lR" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 25px !important;width: 108px !important;" ></a>

## Contributing

### Setup

first install the dependencies

```sh
npm install
```

### Packaging

This only works on linux(and maybe osx) at the moment

```sh
npm run package
```

The resulting package can be found in the build folder.

### Formatting

This project uses code formatting. Make sure to run the formatter before commiting, otherwise the CI will be sad 😢.

```sh
# check it
npm run formatting:test
# run the formatter
npm run formatting:fix
```
