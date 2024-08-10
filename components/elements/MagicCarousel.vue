<template>
  <div id="formList" ref="formList">
    <div id="list" class="flex items-center space-x-4">
      <div v-for="(item, index) in items" :key="index" class="item">
        <img :src="item.imageUrl" class="avatar" />
      </div>
    </div>
  </div>

  <div class="direction flex justify-center items-center">
    <ArrowButtons :disabled="isDisabled" @click="handleArrowClick" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ArrowButtons from "~/components/elements/sliders/ArrowButtons.vue";

const formList = ref(null);
const items = ref([
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
  {
    imageUrl: "/img/absolutehousepainters.png",
  },
  {
    imageUrl: "/img/annapolispainting.png",
  },
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
  {
    imageUrl: "/img/annapolispainting.png",
  },
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
  {
    imageUrl: "/img/absolutehousepainters.png",
  },
  {
    imageUrl: "/img/annapolispainting.png",
  },
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
  {
    imageUrl: "/img/annapolispainting.png",
  },
  {
    imageUrl: "/img/custom-painting-by-dale-vercel-app.png",
  },
]);

const isDisabled = ref(false);

const scrollPrev = () => {
  const widthItem = formList.value.querySelector(".item").offsetWidth;
  formList.value.scrollTo({
    left: formList.value.scrollLeft - widthItem,
    behavior: "smooth",
  });
};

const scrollNext = () => {
  const widthItem = formList.value.querySelector(".item").offsetWidth;
  formList.value.scrollTo({
    left: formList.value.scrollLeft + widthItem,
    behavior: "smooth",
  });
};

const handleArrowClick = (direction) => {
  if (direction === "prev") {
    scrollPrev();
  } else if (direction === "next") {
    scrollNext();
  }
};
</script>

<style scoped>
.direction {
  text-align: center;
}
.direction button {
  font-family: cursive;
  font-weight: bold;
  background-color: #ffffff44;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: 0.5s;
  margin: 0 10px;
}
.direction button:hover {
  background-color: #ffffff;
}
.item {
  border-radius: 15px;
  width: 400px; /* Original width of each item */
  overflow: hidden;
  transition: transform 0.3s ease; /* Add transform animation for smoothness */
  margin: 10px;
  scroll-snap-align: start;
  display: flex; /* Ensure flexbox layout */
  flex-direction: column; /* Arrange content vertically */
  border: 1px solid rgb(138, 138, 138);
  box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.1);
}
.item .avatar {
  width: 100%; /* Make the image fill the width of its container */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover;
  border-radius: 15px 15px 0 0; /* Adjust border radius */
}
#list {
  display: flex;
  width: max-content;
}
#formList {
  width: 100%; /* Full width of its parent */
  max-width: 100%; /* Adjust maximum width as needed */
  overflow: auto;
  scroll-behavior: smooth;
  scroll-snap-type: both;
}
#formList::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: 1024px) {
  .item {
    width: calc(33.3vw - 20px);
  }
  .direction {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .item {
    width: calc(50vw - 20px);
  }
  .direction {
    display: none;
  }
}
</style>
