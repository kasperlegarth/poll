<template>
    <div class="poll-form">
        <div class="poll-form__header">
            <h1>Create new poll</h1>
            <p>Fill out the form and create some options the generate a new poll</p>
        </div>
        <div class="poll-form__section">
            <div class="poll-form__control">
                <label for="poll-title">Poll title</label>
                <input type="text" id="poll-title" v-model="pollTitle" placeholder="Title for your poll">
            </div>
            <div class="poll-form__control">
                <label for="poll-description">Description (optinal)</label>
                <input type="text" id="poll-description" v-model="pollDescription" placeholder="Add a brief description to your poll">
            </div>
        </div>
        <div class="poll-form__section">
            <div class="poll-form__control">
                <label for="poll-question">Poll question</label>
                <textarea id="poll-question" v-model="pollQuestion" placeholder="Eg. What is your favorite movie?"></textarea>
            </div>
            <div class="poll-form__option-list">
                <div class="poll-form__option" v-for="(option, index) in sortedOptions" :key="index">
                    <small>Option {{ index + 1 }}</small>
                    {{ option.name }}
                </div>
            </div>
            <div class="poll-form__control">
                <label for="poll-new-option">Add option</label>
                <input type="text" id="poll-new-option" v-model="newOption" @keyup.enter="addOption" placeholder="New option">
            </div>
        </div>
        <div class="poll-form__section">
            <div class="poll-form__control">
                <label for="poll-multiple-choice">Allow multiple choice</label>
                <input type="checkbox" id="poll-multiple-choice" v-model="pollMultipleChoice">
            </div>
            <div class="poll-form__control">
                <label for="poll-allow-user-input">Allow user options</label>
                <input type="checkbox" id="poll-allow-user-input" v-model="pollAllowUserInput">
            </div>
            <div class="poll-form__controls">
                <label for="poll-show-results">Show results after vote</label>
                <input type="checkbox" id="poll-show-results" v-model="pollShowResults">
            </div>
        </div>
        <Button label="Create poll" @click="createPoll" />
    </div>
</template>

<script>
    import axios from 'axios';
    import Button from '@/components/Button.vue';

    export default {
        name: 'CreatePoll',
        components: { Button },
        data() {
            return {
                pollTitle: '',
                pollDescription: '',
                pollQuestion: '',
                pollMultipleChoice: false,
                pollAllowUserInput: false,
                pollShowResults: true,
                newOption: '',
                options: [],
            }
        },
        computed: {
            sortedOptions() {
                return this.options.slice().sort((a, b) => a.sorting - b.sorting);
            }
        },
        methods: {
            addOption() {
                this.options.push({
                    name: this.newOption,
                    votes: 0,
                    sorting: this.getNextSort()
                });

                this.newOption = '';
            },
            getNextSort() {
                if (this.options.length === 0) {
                    return 1;
                }
                const maxSorting = Math.max(...this.options.map(option => option.sorting));
                return maxSorting + 1;
            },
            generateID() {
                const timestamp = new Date().getTime().toString().substring(2, 7); // Get current timestamp
                const randomPart = Math.random().toString(36).substring(2, 7); // Generate a random string
                return `${randomPart}${timestamp}`;
            },
            async createPoll() {
                const newPoll = {
                    id: this.generateID(),
                    title: this.pollTitle,
                    description: this.pollDescription,
                    question: this.pollQuestion,
                    options: this.options,
                    multipleChoice: this.pollMultipleChoice,
                    userInputs: this.pollAllowUserInput,
                    showResults: this.pollShowResults
                }
                let polls = null;

                await axios.get(`https://api.jsonbin.io/v3/b/${process.env.VUE_APP_BIN_ID}/latest`, {
                    headers: {
                        'X-Master-Key': process.env.VUE_APP_API_KEY,
                        'X-Bin-Meta': 'false'
                    }
                })
                .then(response => {
                    polls = response.data.polls;
                });

                polls.push(newPoll);

                const data = { polls };

                axios.put(`https://api.jsonbin.io/v3/b/${process.env.VUE_APP_BIN_ID}`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': process.env.VUE_APP_API_KEY,
                        'X-Bin-Meta': 'false'
                    }
                })
                .then(response => {
                    console.log(response);
                })
            }
        }
    }
</script>

<style lang="scss">
    .poll-form {
        padding: 32px;
        max-width: 600px;
        margin: 0 auto;

        &__section:not(:last-child) {
            padding-bottom: 48px;
            margin-bottom: 40px;
            border-bottom: solid 1px rgba(0,0,0,0.2);
        }

        &__control {
            display: flex;
            flex-direction: column;

            &:not(:last-child) {
                margin-bottom: 16px;
            }

            label {
                margin-bottom: 4px;
            }

            input[type=text],
            textarea {
                font-size: 18px;
                font-family: var(--font-family);
                padding: 12px 16px;
                border-radius: 6px;
                border: solid 2px var(--color--background);
                box-shadow: 0 3px 6px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.13);

                &:focus,
                &:focus-within {
                    outline: none;
                    border-color: var(--color--flamingo);
                }
            }

            textarea {
                resize: none;
                height: 80px;
            }
        }
    }
</style>