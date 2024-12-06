<template>
  <div>
<!--    <Header/>-->

  <q-page padding>
    <!-- Hero Section -->
    <div class="hero-section text-center q-my-xl">
      <q-img
        src="https://via.placeholder.com/1920x400"
        class="hero-banner"
        alt="Hero Banner"
      />
      <div class="hero-text q-mt-md">
        <h2 class="first-hero-h2">Aprende lo que quieres aprender de manera eficiente.!</h2>
        <p>Improve your English skill, wherever you are.</p>
        <q-btn
          label="Get Started"
          rounded
          color="primary"
          push class="q-mt-md"
          size="xl" />
      </div>
    </div>

    <!-- 첫 카드 그룹. -->
    <div class="q-pa-md row items-start q-gutter-md">

      <q-card class="my-card">
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>
      </q-card>

      <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>
      </q-card>

      <p class="last-two">
      <q-card dark bordered class="bg-grey-9 my-card">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>
        <q-separator dark inset />
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>
      </q-card>

      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>
      </q-card>
        </p>
    </div>

    <div class="hero-text-1 q-mt-md">
      <h2>Aprende lo que quieres aprender de manera eficiente.!</h2>
      <p>Improve your English skill, wherever you are.</p>
      <q-btn
        label="Get Started"
        rounded
        color="primary"
        push class="q-mt-md"
        size="xl" />
    </div>

    <!-- Card Section -->
    <div class="q-gutter-md row justify-center card-group-2">
      <q-card bordered class="q-my-md q-pa-md col-xs-12 col-sm-6 col-md-4">
        <q-card-section>
          <q-img
            src="https://via.placeholder.com/300"
            class="q-mb-md"
            alt="Custom Classes"
          />
          <div class="text-h6">Custom Classes</div>
          <p>We design lessons tailored to your goals. Receive real-time feedback for a better learning experience.</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Learn More" color="warning" />
        </q-card-actions>
      </q-card>

      <q-card bordered class="q-my-md q-pa-md col-xs-12 col-sm-6 col-md-4">
        <q-card-section>
          <q-img
            src="https://via.placeholder.com/300"
            class="q-mb-md"
            alt="Flexible Schedule"
          />
          <div class="text-h6">Flexible Schedule</div>
          <p>Learn at your convenience, whenever you want. You can study even in the busiest of schedules.</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Learn More" color="primary" />
        </q-card-actions>
      </q-card>

      <q-card bordered class="q-my-md q-pa-md col-xs-12 col-sm-6 col-md-4">
        <q-card-section>
          <q-img
            src="https://via.placeholder.com/300"
            class="q-mb-md"
            alt="Expert Tutors"
          />
          <div class="text-h6">Expert Tutors</div>
          <p>Learn with experienced native-speaking tutors. Improve your pronunciation, grammar, and expressions naturally.</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Learn More" color="primary" />
        </q-card-actions>
      </q-card>
    </div>

    <div class="hero-text-2 q-mt-md">
      <h3>Aprende lo que quieres aprender de manera eficiente.!</h3>
      <p>Improve your English skill, wherever you are.</p>
      <q-btn
        label="Get Started"
        rounded
        color="primary"
        push class="q-mt-md"
        size="xl" />
    </div>

    <!-- carousel -->
    <br/>
    <div class="q-pa-md">
      <q-carousel
        animated
        v-model="slide"
        navigation
        infinite
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
        <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
        <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
        <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
      </q-carousel>
    </div>

    <!-- Footer Section -->
    <q-footer class="bg-grey-3 text-center q-pa-md">
      <p>&copy; 2024 Phone English Site. All rights reserved.</p>
      <div class="social-icons">
        <q-icon name="facebook" size="md" class="q-mr-sm" />
        <q-icon name="twitter" size="md" class="q-mr-sm" />
        <q-icon name="instagram" size="md" />
      </div>
    </q-footer>
  </q-page>
  </div>
</template>

<script>
import { ref } from 'vue'
import Header from "pages/Header.vue";

export default {
  components:{Header},
  setup () {
    return {
      slide: ref(1),
      autoplay: ref(true)
    }
  }
}
</script>

<style scoped>
/* 맨상단 배너 */
.hero-banner {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.hero-text {
  //max-width: 800px;
  //margin: 0 auto;
  background-color: orange;
  height: 300px;
  width: 100%;
  border-radius: 8px;
}

.first-hero-h2{
  padding: 10px;
}

.hero-text-1 {
//max-width: 800px;
//margin: 0 auto;
  background-color: #FAF4C0;
  height: 500px;
  width: 100%;
  border-radius: 8px;
}

.hero-text-2 {
//max-width: 800px;
//margin: 0 auto;
  background-color: aqua;
  height: 500px;
  width: 100%;
  border-radius: 8px;
}

.card-group-2{
  margin-top: 50px;
}


.social-icons q-icon {
  color: #333;
  cursor: pointer;
}

.my-card{
width: 100%;
max-width: 250px;}
.last-two{
  //margin: 10px;
}
</style>
