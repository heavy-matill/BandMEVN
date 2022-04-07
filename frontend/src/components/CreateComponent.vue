<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h3 class="text-center">Create Recording</h3>
      <form @submit.prevent="handleSubmitForm">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            v-model="recording.name"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            class="form-control"
            v-model="recording.email"
            required
          />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input
            type="text"
            class="form-control"
            v-model="recording.phone"
            required
          />
        </div>

        <div class="form-group">
          <button class="btn btn-danger btn-block">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recording: {
        name: "",
        email: "",
        phone: "",
      },
    };
  },
  methods: {
    handleSubmitForm() {
      let apiURL = window.location.origin + ":4000/api/create-recording";

      axios
        .post(apiURL, this.recording)
        .then(() => {
          this.$router.push("/view");
          this.recording = {
            name: "",
            email: "",
            phone: "",
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
