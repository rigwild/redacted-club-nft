<template>
  <div class="credits">
    <div><a href="https://github.com/rigwild/redacted-club-nft">Available on GitHub</a></div>
    <div>Made with ❤ by <a href="https://github.com/rigwild">rigwild</a></div>
  </div>

  <h1 class="text-center">Redacted Club NFT Rarity Scores</h1>
  <div class="actions">
    <router-link to="/?sortBy=id"><button>Show Rabbits by ID</button></router-link>
    <router-link to="/?sortBy=score"><button>Show Rabbits by Score</button></router-link>
  </div>

  <router-view></router-view>
</template>

<style>
body {
  max-width: 1260px;
  margin: 0 auto;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.pointer {
  cursor: pointer;
}
.actions {
  text-align: center;
  margin: 15px;
}
.credits {
  text-align: center;
  margin: 15px;
}

@media (max-width: 1280px) {
  .actions > div {
    flex-direction: column;
  }
}
</style>
