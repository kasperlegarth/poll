<template>
    <div v-if="poll" class="voting">
        <div class="voting__header">
            <h1>{{ poll.title }}</h1>
            <p v-if="poll.description" v-html="poll.description"></p>
        </div>
        <div class="voting__question">
            <h2>{{ poll.question }}</h2>
            <div class="voting__options">
                <div class="voting__option" v-for="option in options" :class="{ picked: votes.indexOf(option.sorting) > -1 }" :key="`${poll.id}-${option.sorting}`" @click="vote(option.sorting)"> {{ option.name }}</div>
            </div>
        </div>
        <Button v-if="!votesCasted" @click="castVotes" label="Cast your vote(s)" />
        <h1 v-else>Du har stemt</h1>
    </div>
</template>

<script>
    import axios from 'axios';
    import Button from '@/components/Button.vue';

    export default {
        name: 'ViewPoll',
        components: { Button },
        async created() {
            if(this.$route.params.id) {
                if(this.$checkLocalStorage('gotchaPolls')) {
                    console.log('something')
                    const votedPolls = this.$getLocalStorage('gotchaPolls');
                    const lastTimeForPoll = votedPolls.find(x => x.poll == this.$route.params.id);
                    
                    if(lastTimeForPoll) {
                        this.votesCasted = true;
                        this.votes = lastTimeForPoll.votes;
                    }
                }
                await axios.get(`https://api.jsonbin.io/v3/b/${process.env.VUE_APP_BIN_ID}/latest`, {
                    headers: {
                        'X-Master-Key': process.env.VUE_APP_API_KEY,
                        'X-Bin-Meta': 'false'
                    }
                })
                .then(response => {
                    this.polls = response.data.polls;
                });
            }
        },
        computed: {
            poll() {
                if(this.polls && this.$route.params.id) {
                    return this.polls.find(x => x.id == this.$route.params.id);
                }

                return null;
            },
            options() {
                return this.poll.options.slice().sort((a, b) => a.sorting - b.sorting);
            }
        },
        data() {
            return {
                polls: null,
                votes: [],
                votesCasted: false,
            }
        },
        methods: {
            vote(sorting) {
                const index = this.votes.indexOf(sorting);
                if(index > -1) {
                    this.votes.splice(index, 1)
                } else {
                    if(this.poll.multipleChoice) {
                        this.votes.push(sorting);
                    } else {
                        this.votes = [sorting];
                    }
                }
            },
            castVotes() {
                const pollToUpdate = this.polls.find(x => x.id == this.$route.params.id);

                pollToUpdate.options.forEach(option => {
                    if(this.votes.includes(option.sorting)) {
                        option.votes += 1;
                    }
                })

                const polls = { polls: this.polls };

                if(!this.votesCasted) {
                    axios.put(`https://api.jsonbin.io/v3/b/${process.env.VUE_APP_BIN_ID}`, polls, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Master-Key': process.env.VUE_APP_API_KEY,
                            'X-Bin-Meta': 'false'
                        }
                    })
                    .then(() => {
                        this.updateUserPolls();
                    })
                    .catch(error => {
                        console.log(error);
                        this.votesCasted = false;
                    })

                    this.votesCasted = true;
                }
            },
            updateUserPolls() {
                const poll = {
                    poll: this.poll.id,
                    votes: this.votes
                };

                if(this.$checkLocalStorage('gotchaPolls')) {
                    const currentPolls = this.$getLocalStorage('gotchaPolls');
                    currentPolls.push(poll);

                    this.$setLocalStorage('gotchaPolls', currentPolls);
                } else {
                    this.$setLocalStorage('gotchaPolls', [poll]);
                }
            }
        }
    }
</script>

<style lang="scss">
    .picked {
        border: solid 2px var(--color--flamingo);
    }
</style>