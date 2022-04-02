
<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h3 class="text-center">Import from Jukehost</h3>
            <div class="form-group">
                <label>Source code</label>
                <textarea class="form-control" v-model="text" />
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" v-on:click="parse">
                    Parse
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data: () => ({
        text: 'data-track-id="z9vIos52vXvkPoZDTRaOjeW3O1lhfvJ7" data-value="2022-02-23_211954_Snake Chapel_OH_R.mp3"><ddata-track-id="z9vIos52vXvkPoZDTRaOjeW3O1l12345" data-value="2lol.mp3"><d',
    }),
    methods: {
        parse: async function () {
            let regexpStr =
                /(?:data-track-id=")(?<id>[^"]*)(?:"\sdata-value=")(?<file>[^"]*)/gm;
            let match;
            while ((match = regexpStr.exec(this.text)) != null) {
                await this.add_new_jukehost(match.groups.file, match.groups.id);
            }
        },
        add_new_jukehost: async function (file, id) {
            let apiURL = "http://localhost:4000/api/add-file";
            await axios
                .post(apiURL, {
                    file: file,
                    url: `https://audio.jukehost.co.uk/${id}`,
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>