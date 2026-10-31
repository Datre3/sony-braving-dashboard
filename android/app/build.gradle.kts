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
        // GitHub Actions sets the run number, so every build is numbered.
        val buildNumber = System.getenv("GITHUB_RUN_NUMBER")?.toIntOrNull() ?: 1
        versionCode = buildNumber
        versionName = "build $buildNumber"
    }

    signingConfigs {
        // A fixed, non-secret key used only for sideloading onto your own TV.
        // Keeping it in the repo means every build (local or GitHub Actions) has
        // the same signature, so new versions install over old ones.
        // Generate a private key before publishing to the Play Store.
        create("sideload") {
            storeFile = file("sideload.keystore")
            storePassword = "android"
            keyAlias = "sideload"
            keyPassword = "android"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("sideload")
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
