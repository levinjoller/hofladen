<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- Optional: Ein Zurück-Button, wenn diese Seite von einer anderen aus erreichbar ist -->
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Produkt Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Produkt Übersicht</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <p>Willkommen zur Produkt Übersicht</p>
      </div>
    </ion-content>
  </ion-page>
</template>