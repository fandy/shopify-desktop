import fs from 'fs-extra'
import Liquid from 'liquid-node'

keysetNames = {}
Meteor.methods({
	addKeyset(storeName) {
		let keysetName = Random.id(17)
		keysetNames[storeName] = keysetName
		Shopify.addKeyset(keysetName, {
			api_key: '53ea809b4180e0b1db2706a6fe5ffedb',
			secret: 'e00c1b1ba81c26d4b3d4142e77e64e78'
		})
		console.log(keysetName.secret)
		return keysetName
	},
	readFile(themesPath) {
		let filePath = `${Meteor.absolutePath}/public/themes/${themesPath}`

		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (err, res) => {
				if (err) {
					console.log(err);
					reject(err)
				}
				console.log(res);
				resolve(res)
			})
		})
	},
	parseLiquid(file) {
		return new Promise((resolve, reject) => {
			fs.readFile(`${Meteor.absolutePath}/public/themes/batman-shop-myshopify-com-launchpad-star/config/settings_data.json`, 'utf8', (err, res) => {
				let variables = JSON.parse(res)
				console.log(variables);
				let engine = new Liquid.Engine
				engine.parseAndRender(file, variables)
					.then((res) => {
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
			})
		})
	}
})