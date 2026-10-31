plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.bravia.dashboard"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.bravia.dashboard"
        minSdk = 21
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Sign release builds with the debug key so the APK can be sideloaded
            // without setting up a keystore. Use a real key before publishing.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    // The web dashboard (index.html, css/, js/ at the repo root) is bundled into
    // the APK as assets/dashboard/, so the app works without any hosting.
    sourceSets["main"].assets.srcDir(layout.buildDirectory.dir("generated/dashboard"))
}

val copyDashboard by tasks.registering(Sync::class) {
    from(rootProject.projectDir.parentFile) {
        include("index.html", "css/**", "js/**")
    }
    into(layout.buildDirectory.dir("generated/dashboard/dashboard"))
}

tasks.named("preBuild") {
    dependsOn(copyDashboard)
}
