# vue-mevn-stack-app

# vue-mevn-stack-app
Learn how to create MEVN stack app. (MongoDB, Express, Vue, Node).

[Vue MEVN Stack Tutorial – Build Full Stack Vue.js CRUD App](https://www.positronx.io/vue-mevn-stack-tutorial-build-full-stack-vue-js-crud-app/)

# push backend to heroku
heroku login
heroku container:login
cd .\backend\
heroku container:push web
heroku container:release web
# only necessary to see whats happening
heroku logs --tail

# push frontend to vercel
npm run build
git commit -m "deploy"
git push
vercel is auto deployed

# ToDo
upload
    update existing?
	options: Done, View
regex = Parse (date ist ja kein regex) (info boxen)
	option: capturing groups oder 
	load and save presets
instruments
	use as is
	load and save presets menu
		select preset or make new one
			see list
			save (replace if existing)
			append (if existing)

download menu https://www.npmjs.com/package/@ffmpeg/ffmpeg
	checkbox mastered default true https://github.com/ai-mastering/tutorial-node/blob/master/main.js
	buttons
		latest, custom, cancel
	recording property: mixdown {url, mastered_url, config}
https://stackoverflow.com/questions/50430001/how-to-create-getters-and-setters-for-vuex-namespaced-module-state

App
	test
	Files offline
