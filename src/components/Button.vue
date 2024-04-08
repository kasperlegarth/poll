<template>
    <button class="button">{{ label }}</button>
</template>
<script>
    export default {
        name: 'VueButton',
        props: {
            label: {
                type: String,
                required: true
            }
        }
    }
</script>
<style lang="scss">
    .button {
        padding: 16px 48px;
        font-size: 18px;
        color: var(--color--white);
        background-color: var(--color--flamingo);
        border: none;
        border-radius: 6px;
    }
</style>