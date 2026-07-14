# Proguard rules for Warhammer 40k Recruit Guide
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.jetbrains.kotlinx.serialization.SerialName <fields>;
}
