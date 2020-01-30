<template>
  <div>
    <!-- Login Alert Errors Messages -->
    <b-alert v-model="showDismissibleAlert" :variant="variant" dismissible>{{
      errorMsg
    }}</b-alert>
    <!--End Login Alert Errors Messages -->

    <!-- Modal Area -->
    <div>
      <b-modal @ok="putBadword" id="edit-badword" title="Edit badword">
        <b-form>
          <b-form-group>
            <label for="">Word</label>
            <b-input v-model="currentWord" type="text"></b-input>
          </b-form-group>
          <b-form-group>
            <label for="">Level</label>
            <b-input
              v-model="currentLevel"
              type="number"
              min="1"
              max="5"
            ></b-input>
          </b-form-group>
        </b-form>
      </b-modal>
      <b-modal @ok="deleteBadword" id="delete-badword" title="Delete badword">
        <b-form>
          <b-form-group>
            <label for="">Word</label>
            <b-input
              v-model="currentWord"
              type="text"
              readonly="readonly"
            ></b-input>
          </b-form-group>
          <b-form-group>
            <label for="">Level</label>
            <b-input
              v-model="currentLevel"
              type="number"
              min="1"
              max="5"
              readonly="readonly"
            ></b-input>
          </b-form-group>
        </b-form>
      </b-modal>
    </div>
    <!-- End Modal Area -->

    <table class="table table-striped ">
      <thead>
        <tr class="d-flex">
          <th class="col-5">
            <input type="text" v-model="newBadword" placeholder="Insert a new BadWord" />
            <label for="newLevel">Level</label>
            <input type="number" v-model="newLevel" min="1" max="5" />

            <button class="btn btn-sm btn-secondary" @click="addBadword">
              Add
            </button>
          </th>
          <th class="col-5">
            word
          </th>
          <th class="col-2">
            level
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="d-flex" v-for="(badword, index) in badwords" :key="index">
          <td class="col-5">
            <b-button
              @click="showBadwordForEdit(index)"
              class="btn btn-sm btn-primary"
              >Edit
            </b-button>
            <b-button
              @click="showBadwordForDelete(index)"
              class="btn btn-sm btn-danger"
            >
              Delete</b-button
            >
          </td>
          <td class="col-5">
            {{ badword.word }}
          </td>
          <td class="col-2">
            {{ badword.level }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newBadword: "",
      newLevel: 1,

      currentId: "",
      currentWord: "",
      currentLevel: 1,
      currentRowVersion: 0,

      errorMsg: "",
      showDismissibleAlert: false,
      variant: "danger"
    };
  },
  computed: {
    badwords() {
      return this.$store.state.badwords;
    },
    currentBadword() {
      return this.$store.state.currentBadword;
    }
  },
  methods: {
    async getBadwords() {
      let badwordsResponse = await axios.get(
        `http://localhost:3000/api/blog/badwords`
      );
      this.$store.dispatch("setBadwords", badwordsResponse.data);
    },
    async addBadword() {
      try {
        let badword = {
          word: this.newBadword,
          level: this.newLevel
        };
        await axios.post("http://localhost:3000/api/blog/badwords", badword);
        await this.getBadwords();
        this.showSuccess(`${badword.word} added`);
      } catch (error) {
        this.showError(error.response.data.message);
      }
    },

    showBadwordForEdit(index) {
      let currentBadword = this.badwords[index];
      this.currentId = currentBadword.id;
      this.currentWord = currentBadword.word;
      this.currentLevel = currentBadword.level;
      this.currentRowVersion = currentBadword.rowVersion;
      this.$bvModal.show("edit-badword");
    },
    async putBadword() {
      try {
        let badwordDTO = {
          id: this.currentId,
          word: this.currentWord,
          level: this.currentLevel,
          rowVersion: this.currentRowVersion
        };
        await axios.put(
          `http://localhost:3000/api/blog/badwords/${badwordDTO.id}`,
          badwordDTO
        );
        await this.getBadwords();
        this.showSuccess(`${badwordDTO.word} updated`);
        this.$bvModal.hide("edit-badword");
      } catch (error) {
        this.showError(error.response.data);
      }
    },
    showBadwordForDelete(index) {
      let currentBadword = this.badwords[index];
      this.currentId = currentBadword.id;
      this.currentWord = currentBadword.word;
      this.currentLevel = currentBadword.level;
      this.currentRowVersion = currentBadword.rowVersion;
      this.$bvModal.show("delete-badword");
    },
    async deleteBadword() {
      try {
        await axios.delete(
          `http://localhost:3000/api/blog/badwords/${this.currentId}`
        );
        await this.getBadwords();
        this.showWarning(`${this.currentWord} deleted`);
        this.$bvModal.hide("delete-badword");
      } catch (error) {
        this.showError(error.response.data);
      }
    },

    showError(message) {
      this.errorMsg = message;
      this.variant = "danger";
      this.showDismissibleAlert = true;
    },
    showSuccess(message) {
      this.errorMsg = message;
      this.variant = "success";
      this.showDismissibleAlert = true;
    },
    showWarning(message) {
      this.errorMsg = message;
      this.variant = "warning";
      this.showDismissibleAlert = true;
    }
  },
  async created() {
    await this.getBadwords();
  }
};
</script>

<style></style>
