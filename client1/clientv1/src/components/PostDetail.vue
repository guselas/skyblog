<template>
    <div>
        <div class="row">
            <div class="col-11">
                <!-- Posts cards Area -->
                <div>
                    <h3>{{ currentPost.title }}</h3>
                </div>
                <!-- Post Info -->
                <div class="card">
                    <h3 id="postDetailsTitle">Post Details</h3>
                    <div class="col jumbotron">
                        <div class="card-header" style="text-align:center">
                            {{currentPost.postTitle}}
                        </div>
                        <div class="card-body">
                            {{currentPost.postText}}
                        </div>
                        <div class="card-footer" style="text-align:center">
                            <div class="row">
                                <div class="col-4">
                                    <b-badge variant="info">Postter NickName</b-badge> {{currentPost.nickName}}
                                </div>
                                <div class="col-4">
                                    <b-badge variant="info">Post date</b-badge> {{ currentPost.postDate }}
                                </div>
                                <div class="col-4">
                                    <b-badge variant="info">Category</b-badge> {{ currentPost.category }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End Post Info -->
                <!--End Posts cards Area -->
                <!-- Comments buttons Area -->
                <div>
                    <b-button v-b-modal.modal-sl block pill variant="primary" size="lg" @click="openModal">New Comment
                    </b-button>
                    <b-modal @ok="newComment()" id="modal-sl" size="lg" title="Comment Details">
                        <b-col sm="2">
                            <label for="textarea-large">Post content:</label>
                        </b-col>
                        <b-col sm="10">
                            <b-form-textarea v-model="commentText" id="textarea-large" size="lg">
                            </b-form-textarea>
                        </b-col>
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
                <!--End Comments buttons Area -->

                <!-- Comments cards Area -->
                <div class="card" v-for="comment in currentPost.comments" :key="comment.id">
                    <div class="card-header">
                    </div>
                    <div class="card-body">
                        {{comment.commentText}}
                    </div>
                    <div class="card-footer">
                        {{comment.nickName}} || {{  comment.commentDate}} || {{ comment.lastUpdate }} || likes
                    </div>
                    <hr>
                </div>
                <!--End Comments cards Area -->
            </div>

            <!-- Nav bar Commands Area -->
            <div class="col-1">

                <b-button-group vertical>
                    <!-- <b-button v-b-modal.modal-create block pill variant="primary" size="lg" class="b-button">New
                        Post
                    </b-button> -->
                    <b-modal id="modal-create" size="xl" title="Overflowing Content">
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
                    <!-- <button class="btn btn-info" @click="refreshPost()">Refresh</button> -->
                    <b-button v-if="isAdmin || isAuthor" v-b-modal.modal-delete block pill variant="danger" size="lg"
                        class="b-button">
                        Delete Post
                    </b-button>
                    <b-modal id="modal-delete" title="Confirmation needed" size="xl"> Are you sure you want to
                        delete
                        this
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
                    <b-button v-b-modal.modal-report block pill variant="warning" size="lg" class="b-button">
                        Report Post
                    </b-button>
                    <b-modal id="modal-report" title="Confirmation needed" size="xl">
                        <hr> Why do you want to report this post?
                        <b-form-checkbox-group v-model="selected" :options="options" class="mb-3" value-field="item"
                            text-field="name" disabled-field="notEnabled">
                        </b-form-checkbox-group>
                        <hr>
                        <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
                    </b-modal>
                </b-button-group>

            </div>
        </div>

    </div>

</template>

<script>
    import axios from "axios";

    export default {

        name: "postDetail",
        data() {
            return {
                selected: [],
                options: [{
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
                ],
                commentText: ""
            }
        },
        computed: {
            currentPost() {
                return this.$store.state.currentPost;
            },
            currentPostId() {
                return this.$store.state.currentPostId;
            },
            isAuthor() {
                return this.$store.getters.isAuthor;
            },
            isAdmin() {
                return this.$store.getters.isAdmin;
            }
        },
        async mounted() {
            let id = this.$route.params.id;
            await this.getCurrentPost(id);
        },
        methods: {
            async getCurrentPost(id) {
                let currentPostResponse = await axios.get(`http://localhost:3000/api/blog/${id}`);
                this.$store.dispatch('setCurrentPost', currentPostResponse.data);
            },
            async refreshPost() {
                await this.getCurrentPost(this.currentPostId);
            },
            async newComment() {
                try {
                let newCommentDTO = {
                    commentText : this.commentText
                };
                let postId = this.$store.state.currentPost.id;
                /* eslint-disable no-console */
                console.log("this.$store.state.currentPost.id: ", this.$store.state.currentPost.id);
                console.log("newCommentDTO: ", newCommentDTO.commentText);
                /* eslint-enable no-console */

                let commentResponse = await axios.post(`http://localhost:3000/api/blog/${postId}/comment`,
                    newCommentDTO);
                /* eslint-disable no-console */
                console.log("this.$store.state.currentPost: ", this.$store.state.currentPost);
                console.log("commentResponse: ", commentResponse);
                /* eslint-enable no-console */
                await this.refreshPost();                
 
                } catch (error) {
                /* eslint-disable no-console */
                console.log("error at newComment(): ", error);
                /* eslint-enable no-console */
                }
            },
            openModal(bvModalEvt) {
                bvModalEvt.preventDefault();
                // Trigger submit handler
                //  this.newComment();

            }
        },

    };
</script>

<style scoped>
    .b-button {
        margin-top: 10px;
        margin-bottom: 10px;

    }

    #postDetailsTitle {
        font-family: 'Sedgwick Ave', cursive;
    }
</style>