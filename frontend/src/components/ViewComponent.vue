<template>
    <div>
        <div v-if="mix_id" style="width: 100%; min-height:150px">
            <AudioMixer
                :key="mixer_reload"
                @loaded="loadedChange"
                :config="config"
                ref="audiomixer"
            />
            <div v-if="is_loaded" class="text-center">
                <b-button-group>
                    <b-button  v-if="false">Download Mix</b-button>
                    <b-dropdown
                        right
                        split
                        text="Store Settings"
                        v-on:click="store_mixer_config(true, true)"
                    >
                        <b-dropdown-item
                            v-on:click="store_mixer_config(true, false)"
                            >Gains only</b-dropdown-item
                        >
                        <b-dropdown-item
                            v-on:click="store_mixer_config(false, true)"
                            >Pans only</b-dropdown-item
                        >
                    </b-dropdown>
                    <b-dropdown
                        right
                        split
                        text="Reload Settings"
                        v-on:click="load_mixer_config()"
                    >
                        <b-dropdown-item
                            v-on:click="load_mixer_config(true, false)"
                            >Gains only</b-dropdown-item
                        >
                        <b-dropdown-item
                            v-on:click="load_mixer_config(false, true)"
                            >Pans only</b-dropdown-item
                        >
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item v-on:click="reset_mixer_config()"
                            >Reset</b-dropdown-item
                        >
                    </b-dropdown>
                </b-button-group>
            </div>
        </div>
        <b-form-checkbox
            v-if="false"
            v-model="online"
            name="online-button"
            switch
        >
            <div v-if="online">Online</div>
            <div v-else>Local</div>
        </b-form-checkbox>
        <div v-if="false">
            <audio :src="audio" controls />
            <br />
            <button @click="transcode">Start</button>
            <p>{{ ffmpeg_message }}</p>
        </div>
        <list-component
            :mix_id="mix_id"
            v-on:load-pans="load_pans"
            v-on:load-gains="load_gains"
        />
    </div>
</template>
<script src="http://localhost:8080/ffmpeg.min.js"></script>
<script>
import axios from "axios";
import ListComponent from "./ListComponent.vue";
import AudioMixer from "./AudioMixer.vue";

export default {
    data() {
        return {
            recording: {},
            mix_id: "",
            online: true,
            mixer_reload: 0,
            is_loaded: false,
            config: {
                tracks: [],
                master: {
                    pan: 0,
                    gain: 1,
                    muted: false,
                },
            },
            ffmpeg: { type: Object, default: null },
            audio: { type: Object, default: null },
            ffmpeg_state: 0,
            ffmpeg_message: "",
        };
    },
    components: { AudioMixer, ListComponent },
    created() {
        this.mix_id = this.$route.params.id;
        if (this.mix_id) {
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${this.$route.params.id}`;
            axios.get(apiURL).then((res) => {
                this.recording = res.data;
                this.load_config();
            });
        }
    },
    watch: {
        "$route.params.id": function () {
            this.mix_id = this.$route.params.id;

            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${this.$route.params.id}`;
            axios.get(apiURL).then((res) => {
                this.recording = res.data;
                this.load_config();
            });
        },
    },
    methods: {
        load_config() {
            let audiomixer = this.$refs.audiomixer.$children[0];
            if (audiomixer.playing) audiomixer.stop();
            this.is_loaded = false;
            this.mixer_reload++;
            this.config.tracks = [];
            for (const track of this.recording.tracks) {
                let url;
                if (this.online) {
                    url = track.url;
                } else {
                    url = `${
                        process.env.VUE_APP_BACKEND_URI ||
                        window.location.origin
                            .split(":")
                            .slice(0, -1)
                            .join(":") + ":4000"
                    }/audio-files/${track.file}`;
                }
                this.config.tracks.push({
                    title: track.title,
                    url: url,
                    pan: track.pan ?? 0,
                    gain: track.gain ?? 0.5,
                    muted: false,
                    hidden: false,
                });
            }
        },
        store_mixer_config: async function (bGains = true, bPans = true) {
            let updates = [];
            for (const track of this.config.tracks) {
                let update = { title: track.title };
                if (bGains) {
                    update.gain = track.gain;
                }
                if (bPans) {
                    update.pan = track.pan;
                }
                updates.push(update);
            }
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/update-recording/${this.mix_id}`;
            await axios.post(apiURL, updates).catch((error) => {
                console.log(error);
            });
        },
        reset_mixer_config: async function () {
            for (const track of this.config.tracks) {
                track.gain = 0.5;
                track.pan = 0;
            }
        },
        load_pans: function (id) {
            this.load_mixer_config(false, true, id);
        },
        load_gains: function (id) {
            this.load_mixer_config(true, false, id);
        },
        load_mixer_config: async function (
            bGains = true,
            bPans = true,
            id = this.mix_id
        ) {
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${id}`;
            axios.get(apiURL).then((res) => {
                for (const track of res.data.tracks) {
                    for (let i = 0; i < this.config.tracks.length; i++) {
                        if (this.config.tracks[i].title == track.title) {
                            if (bGains && track.gain != null) {
                                this.config.tracks[i].gain = track.gain;
                            }
                            if (bPans && track.pan != null) {
                                this.config.tracks[i].pan = track.pan;
                            }
                        }
                    }
                }
            });
        },

        loadedChange(loaded) {
            this.is_loaded = loaded;
        },
        /*initFfmpeg() {
            //const { createFFmpeg, fetchFile } = FFmpeg;
            if (this.ffmpeg === null) {
                this.ffmpeg = createFFmpeg({
                    corePath: "http://localhost:8080/ffmpeg-core.js",
                    log: true,
                });
            }
            this.ffmpeg_message = "Initialized";
            this.audio = null;
        },
        transcode: async function () {
            this.initFfmpeg();
            this.ffmpeg_message = "Loading ffmpeg-core.js";
            if (!this.ffmpeg.isLoaded()) {
                await this.ffmpeg.load();
            }
            this.ffmpeg_message = "Start transcoding";
            let ffmpeg_cmd = [];
            let ffmpeg_amerge = "";
            let ffmpeg_pan_L = [];
            let ffmpeg_pan_R = [];
            let files = this.$refs["vue-audio-mixer"].data.files;
            for (const [index, track] of this.config.tracks.entries()) {
                // no fetch needed if loaded in mixer
                this.ffmpeg.FS(
                    "writeFile",
                    `${index}.mp3`,
                    files[index] //await fetchFile(track.url)
                );
                ffmpeg_cmd.push("-i");
                ffmpeg_cmd.push(`${index}.mp3`);
                ffmpeg_amerge += `[${index}]`;
                let pan_fac_R =
                    Math.sin(((track.pan + 90) * Math.PI) / 360) *
                    track.gain; //* master gain
                let pan_fac_L =
                    Math.cos(((track.pan + 90) * Math.PI) / 360) *
                    track.gain; //* master gain
                ffmpeg_pan_L.push(`${pan_fac_L}*c${index}`);
                ffmpeg_pan_R.push(`${pan_fac_R}*c${index}`);
            }
            ffmpeg_cmd.push("-filter_complex");
            ffmpeg_cmd.push(
                `${ffmpeg_amerge}amerge=inputs=${
                    config.tracks.length
                },pan=stereo|FL=${ffmpeg_pan_L.join(
                    "+"
                )}|FR=${ffmpeg_pan_R.join("+")}`
            );
            ffmpeg_cmd.push("mix.mp3");
            //ffmpeg -i L.wav -i R.wav -filter_complex "[0][1]amerge=inputs=2,pan=stereo|FL=c0+0.5*c1|FR=c1" mixL.mp3
            //await ffmpeg.run("-i", "test.mp3", "test.wav");
            await this.ffmpeg.run(...ffmpeg_cmd);
            ffmpeg_message = "Complete transcoding";
            const data = this.ffmpeg.FS("readFile", "mix.mp3");
            audio = URL.createObjectURL(
                new Blob([data.buffer], { type: "audio/mp3" })
            );
        },*/
    },
};
</script>
<style>
body {
    overflow-x: hidden;
}
</style>>

