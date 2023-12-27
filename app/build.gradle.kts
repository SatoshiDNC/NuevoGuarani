import com.android.build.gradle.internal.tasks.factory.dependsOn

plugins {
    id("com.android.application")
}

tasks.register<Copy>("preCopy") {
    from(layout.projectDirectory.file("../web/index.html"))
    into(layout.projectDirectory.dir("src/main/res/raw"))
    rename("(.+)[.]html", "$1.raw")
}

android {
    project.tasks.preBuild.dependsOn("preCopy")
    namespace = "com.satoshidnc.nuevoguarani"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.satoshidnc.nuevoguarani"
        minSdk = 26
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.10.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.navigation:navigation-fragment:2.7.6")
    implementation("androidx.navigation:navigation-ui:2.7.6")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    implementation("androidx.work:work-runtime:2.9.0")
    implementation("com.neovisionaries:nv-websocket-client:2.14")
    implementation("androidx.webkit:webkit:1.9.0")
    implementation("commons-io:commons-io:2.4")
}