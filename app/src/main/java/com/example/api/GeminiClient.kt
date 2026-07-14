package com.example.api

import com.example.BuildConfig
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

@Serializable
data class GenerateContentRequest(
    val contents: List<Content>,
    val generationConfig: GenerationConfig? = null,
    val systemInstruction: Content? = null
)

@Serializable
data class Content(
    val parts: List<Part>,
    val role: String? = null
)

@Serializable
data class Part(
    val text: String
)

@Serializable
data class GenerationConfig(
    val temperature: Float? = null,
    val topP: Float? = null,
    val topK: Int? = null
)

@Serializable
data class GenerateContentResponse(
    val candidates: List<Candidate> = emptyList()
)

@Serializable
data class Candidate(
    val content: Content
)

interface GeminiApiService {
    @POST("v1beta/models/gemini-3.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GenerateContentRequest
    ): GenerateContentResponse
}

object RetrofitClient {
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    val service: GeminiApiService by lazy {
        val json = Json { ignoreUnknownKeys = true }
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
        retrofit.create(GeminiApiService::class.java)
    }
}

object GeminiClient {
    private const val SYSTEM_INSTRUCTION = """You are the Codex Rules Sage, an elite Warhammer 40,000 10th Edition rules referee and guide.
Your role is to answer questions for brand-new or learning players in a clear, supportive, and highly structured manner.
Rules Guideline:
- Always base your answers strictly on Warhammer 40k 10th Edition rules.
- Do NOT refer to older editions (like 9th or 8th) unless specifically contrasting, and keep it brief. Highlight 10th Edition innovations (e.g., Battle-shock replacing Morale, Toughness scale expansion, simplified psychic mechanics integrated into weapons/abilities, Objective Control OC stat, and Combat Patrol preset game modes).
- Keep answers scannable and digestible! Use bold text for stats (e.g., **S** for Strength, **T** for Toughness, **SV** for Armor Save, **Ld** for Leadership, **OC** for Objective Control) and bullet points for lists.
- Be concise. Players might be reading your answer directly at the gaming table during a live match. Aim to give a direct, fully correct answer in under 180 words if possible.
- If a rule depends on situational abilities or stratagems, explain the base rule first, then mention exceptions."""

    suspend fun consultSage(conversationHistory: List<Content>, userPrompt: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "YOUR_GEMINI_API_KEY_HERE") {
            return@withContext "Sacred vox link error: No GEMINI_API_KEY defined. Please set your Gemini API Key in the AI Studio Secrets panel!"
        }

        // Construct full contents array (history + current prompt)
        val fullContents = conversationHistory + Content(parts = listOf(Part(text = userPrompt)), role = "user")

        val request = GenerateContentRequest(
            contents = fullContents,
            generationConfig = GenerationConfig(temperature = 0.7f),
            systemInstruction = Content(parts = listOf(Part(text = SYSTEM_INSTRUCTION)))
        )

        try {
            val response = RetrofitClient.service.generateContent(apiKey, request)
            response.candidates.firstOrNull()?.content?.parts?.firstOrNull()?.text 
                ?: "No response from the Sacred Sage. Check your warp connection."
        } catch (e: Exception) {
            e.printStackTrace()
            "Failed to contact the Codex Rules Sage. Details: ${e.localizedMessage ?: e.message ?: "Unknown psychic static"}"
        }
    }
}
