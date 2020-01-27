<template>
    <div>
        <h3>Post Details</h3>
        <div class="row">
            <div class="col-10">
                <!-- Posts cards Area -->
                <div>
                    <h3>this.$store.state.currentPost.data.id</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col jumbotron">
                            <div class="card-header">
                                this.$store.state.currentPost.data .postTitle
                            </div>
                            <div class="card-body">
                                this.$store.state.currentPost.data.postText
                            </div>
                            <div class="card-footer">
                                this.$store.state.currentPost.data.nickName -
                                this.$store.state.currentPost.data.postDate - Likes
                            </div>
                        </div>
                    </div>
                </div>
                <!--End Posts cards Area -->
                <div class="card">
                    <div class="card-header"></div>
                    <div class="card-body"></div>
                    <div class="card-footer"></div>
                </div>
            </div>

            <div class="col-2">
                <div>Nav Bar</div>
                <div>
                    <b-button v-b-modal.modal-xl variant="primary" size="lg">New Post</b-button>
                    <b-modal id="modal-xl" size="xl" title="Overflowing Content">
                        <b-col sm="2">
                            <label for="textarea-large">Post Title:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-textarea id="textarea-large" size="lg">
                            </b-form-textarea>
                        </b-col>
                        <b-col sm="2">
                            <label for="textarea-large">Post content:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-textarea id="textarea-large" size="lg">
                            </b-form-textarea>
                        </b-col>
                        <hr>
                        <button>Upload picture</button>
                        <hr>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <input type="radio" aria-label="Radio button for following text input">
                                </div>
                            </div>
                            <input type="text" readonly class="form-control" placeholder="Accept terms and conditions"
                                aria-label="Text input with radio button">
                        </div>
                    </b-modal>
                </div>
                <div>
                    <b-button v-b-modal.modal-xl1 variant="success" size="lg">Update Post</b-button>
                    <b-modal id="modal-xl1" title="Confirmation needed" size="xl"> Are you sure you want to save this
                        post ?
                        <p class="my-4">
                            <p> Post.title</p>
                            <p> Post.textContent</p>
                            <p> Post.postDate</p>
                            <template v-slot:modal-footer="{ ok, cancel }">
                                <!-- Emulate built in modal footer ok and cancel button actions -->
                                <b-button size="sm" variant="success" @click="ok()">
                                    Submit
                                </b-button>
                                <b-button size="sm" variant="danger" @click="cancel()">
                                    Cancel
                                </b-button>
                            </template>
                    </b-modal>

                </div>
                <div>
                    <b-button v-b-modal.modal-delete variant="danger" size="lg">Delete Post</b-button>
                    <b-modal id="modal-delete" title="Confirmation needed" size="xl"> Are you sure you want to delete this
                        post ?
                        <p class="my-4">
                            <p> This posts por has these comments associated:
                                <ul>
                                    <li>
                                        Comment.Id || Comment.commentText || Comment.lastUpdate
                                    </li>
                                </ul>
                            </p>
                            <template v-slot:modal-footer="{ ok, cancel }">
                                <!-- Emulate built in modal footer ok and cancel button actions -->
                                <b-button size="sm" variant="success" @click="ok()">
                                    Submit
                                </b-button>
                                <b-button size="sm" variant="danger" @click="cancel()">
                                    Cancel
                                </b-button>
                            </template>
                    </b-modal>
                </div>
                <div>
                    <b-button v-b-modal.modal-report variant="danger" size="lg">Report Post</b-button>
                    <b-modal id="modal-report" title="Confirmation needed" size="xl"> <hr> Why do you want to report this post?
                        <b-form-checkbox-group v-model="selected" :options="options" class="mb-3" value-field="item"
                            text-field="name" disabled-field="notEnabled"></b-form-checkbox-group>
                            <hr>
                        <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
                    </b-modal>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import axios from "axios";
    export default {
        name: "postDetails",
        data() {
            return {
                selected: [],
                options: [
                    {
                        item: 'Too offensive',
                        name: 'Too offensive'
                    },
                    {
                        item: 'Not interesting',
                        name: 'Not interesting'
                    },
                    {
                        item: 'Too booring',
                        name: 'Too booring'
                    },
                    {
                        item: 'Lack of content',
                        name: 'Lack of content'
                    },
                ]
            }
        },
        components: {},
        props: {

        },
        methods: {
            async getPost() {
                // let id = this.$store.state.currentPost.data.id;
                let postResponse = await axios.get(
                    `http://localhost:3000/api/blog/5e272b046d7edf68f70686a2`
                );
                /* eslint-disable no-console */
                await console.log("postResponse", postResponse);
                /* eslint-enable no-console */
                this.$store.state.currentPost = postResponse;
                /* eslint-disable no-console */
                await console.log(
                    "this.$store.state.currentPost.data",
                    this.$store.state.currentPost.data
                );
                /* eslint-enable no-console */
            }
        },
        async created() {
            await this.getPost();
        }
    };
</script>