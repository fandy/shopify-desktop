import fs from 'fs-extra';
import Liquid from 'liquid-node';
const phantom = Meteor.npmRequire('phantom'); // phantom promise library not working, webdriverio not working with Meteor load order.
const Nightmare = Meteor.npmRequire('nightmare'); // requires "phantom"
const cheerio = Meteor.npmRequire('cheerio');
const notifier = Meteor.npmRequire('node-notifier');

keysetNames = {};
Shopify.onAuth((accessToken, config) => {
  Shopify.addKeyset(keysetNames[config.shop], {
    access_token: accessToken,
  });
});

Meteor.methods({
  addKeyset(storeName) {
    const keysetName = Random.id(17);
    keysetNames[storeName] = keysetName;
    Shopify.addKeyset(keysetName, {
      api_key: Meteor.settings.shopify.key,
      secret: Meteor.settings.shopify.secret
    });

    User.update({}, {
      $set: {
        loggedIn: true,
        storeName: storeName,
        keyset: keysetName
      }
    });

    return keysetName;
  },
  readFile(file) {
    return new Promise((resolve, reject) => {
      let filePath = `${Meteor.absolutePath}/public/themes/${file}`;
      console.log(filePath);
      fs.readFile(filePath, 'utf8', (err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  },
  parseLiquid(fileContents, variables) {
    return new Promise((resolve, reject) => {
      // Variables data
      let variablesPath = `${Meteor.absolutePath}/public/themes/batman-shop-myshopify-com-launchpad-star/config/settings_data.json`;
      fs.readFile(variablesPath, 'utf8', (err, data) => {
        if (err) reject(err);
        let variables = JSON.parse(data);
        let engine = new Liquid.Engine;
        let parsedFile = engine.parseAndRender(fileContents, variables).then((res) => {
          resolve(res);
        }).catch(err => {
          throw new err
        });
      });
    });
  },
  addThemes(themes) {
    User.update({
      loggedIn: true
    }, {
      $set: {
        themes: themes
      }
    });
  },
  proxyShopify(url) {
    return new Promise((resolve, reject) => {
      console.log('Proxying shopify...');
      const nightmare = new Nightmare({
          show: false
        }).goto(url)
        .wait()
        .click('a[href="#LoginModal"]')
        .visible('#login_form')
        .insert('input[type="password"]', 'stohra')
        .click('#login_form [type="submit"]')
        .wait()
        .visible('#PageContainer')
        .wait(1000) // form is appended to DOM after AJAX request from Shopify
        .evaluate(() => document.getElementsByTagName('html')[0].outerHTML)
        .end()
        .then((html) => {
          let $ = cheerio.load(html);
          let head = $('head').toString();
          let body = $('body').toString();
          let res = {
            head,
            body
          }
          User.update({ loggedIn: true }, {
            $set: {
              html: res
            }
          });
          console.log(`Resolved ${url} to the client`);
          resolve(res);
        });
    });
  },
  changeScreenSize(size) {
    User.update({ loggedIn: true }, {
      $set: {
        screenSize: size
      }
    });
  },
  toggleEditable() {
    User.update({}, {
      $set: {
        editable: !User.findOne().editable
      }
    });
    console.log(`Edit mode set to ${User.findOne().editable}`);
    return User.findOne().editable;
  }
});
