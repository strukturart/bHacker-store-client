![logo](/images/logo.png)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## bHacker-store

An alternative app store by free developers for free devices.
The database of apps is hosted [here](https://gitlab.com/banana-hackers/store-db/-/tree/master), further can be added by a pull request.

### Features

- Install apps from the coders source

![image-1](/images/image-1.png)
![image-2](/images/image-2.png)
![image-3](/images/image-3.png)
![image-4](/images/image-4.png)

## How to sideload the app on your device

### Omni SD

Download [bHackerStore App](https://github.com/strukturart/bHacker-store/releases/latest).
Copy this zip file to the apps directory of the memory card.
Open "OmniSD" and install this zip.

### Web IDE

Download [bHackerStore App](https://github.com/strukturart/bHacker-store/releases/latest).
Extract this zip to a folder.
Click "Open Packaged App" and select the folder from the previous step.
Click "Install and Run" button.

## Thank you

- SimonLaux and the discord [community](https://discord.gg/t2CBPb)

## Donation

If you use the app often, please donate an amount.
<br>
<table class="border-0"> 
  <tr class="border-0" >
    <td valign="top" class="border-0">
        <div>
            <a href="https://paypal.me/strukturart?locale.x=de_DE" target="_blank">
                <img src="/images/paypal.png" width="120px">
            </a>
        </div>
    </td>
    <td valign="top" class="border-0">
        <div>
            <div>Bitcoin</div>
            <img src="/images/bitcoin_rcv.png" width="120px">
        </div>
    </td>
  </tr>
 </table>

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://notabug.org/farooqkz"><img src="https://avatars0.githubusercontent.com/u/15038218?v=4" width="100px;" alt=""/><br /><sub><b>Farooq Karimi Zadeh</b></sub></a><br /><a href="#ideas-farooqkz" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Simon-Laux"><img src="https://avatars2.githubusercontent.com/u/18725968?v=4" width="100px;" alt=""/><br /><sub><b>Simon Laux</b></sub></a><br /><a href="https://github.com/strukturart/bHacker-store-client/commits?author=Simon-Laux" title="Code">💻</a></td>
    <td align="center"><a href="http://strukturart.com"><img src="https://avatars0.githubusercontent.com/u/5286893?v=4" width="100px;" alt=""/><br /><sub><b>John-David Deubl</b></sub></a><br /><a href="https://github.com/strukturart/bHacker-store-client/commits?author=strukturart" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
