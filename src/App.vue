<template>
  <routerView></routerView>
</template>

<script>
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');

  :root {
    --color--background: #fafafa;
    --color--black: #000000;
    --color--white: #ffffff;
    --color--grey: #596275;
    --color--flamingo: #f78fb3;

    --font-family: Manrope;
  }
  
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    color: var(--color--grey);
    font-size: 18px;
    font-family: var(--font-family);
    background-color: var(--color--background);
  }

  h1, h2 {
    margin-bottom: 10px;
    font-weight: 800;
    color: var(--color--black);
  }

  p {
    margin-top: 0;
  }
</style>