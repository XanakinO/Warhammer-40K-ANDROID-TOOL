package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.ChatMsg
import com.example.ui.MainViewModel
import kotlinx.coroutines.launch

@Composable
fun SageScreen(viewModel: MainViewModel) {
    val messages by viewModel.chatMessages.collectAsState()
    val isLoading by viewModel.isSageLoading.collectAsState()
    var inputQuery by remember { mutableStateOf("") }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    // Auto-scroll on new message
    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GrimDarkBg)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .border(BorderStroke(1.dp, Brush.horizontalGradient(listOf(Color(0xFF451A03), AmberGold, Color(0xFF451A03)))))
                .background(GrimDarkCard)
                .padding(vertical = 12.dp, horizontal = 16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "SACRED RULES SAGE SENSORS",
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif,
                        letterSpacing = 2.sp
                    )
                    Text(
                        text = "WARHAMMER 40K 10TH ED RULES CLARIFIER",
                        color = AmberGold,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
                IconButton(
                    onClick = { viewModel.clearSageChat() },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Clear Chat",
                        tint = Color.Red.copy(alpha = 0.8f)
                    )
                }
            }
        }

        // Quick suggestions panel
        if (messages.size == 1) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = "SELECT SACRED RULE INQUIRY PROTOCOL:",
                    color = AmberGold,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                val suggestions = listOf(
                    "How does Battle-shock work in 10th?",
                    "What is Objective Control (OC) metric?",
                    "Explain Feel No Pain vs normal Saving Throws",
                    "Can a unit Advance and Charge?"
                )
                suggestions.forEach { suggestion ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                        border = BorderStroke(1.dp, GrimDarkBorder),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable {
                                viewModel.sendSageMessage(suggestion)
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Chat,
                                contentDescription = "Query",
                                tint = AmberGold,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = suggestion,
                                color = LightParchment,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Messages list
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isSage = msg.sender == "sage"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isSage) Arrangement.Start else Arrangement.End
                ) {
                    if (isSage) {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                            border = BorderStroke(1.dp, AmberGold.copy(alpha = 0.3f)),
                            shape = RoundedCornerShape(topStart = 0.dp, topEnd = 12.dp, bottomStart = 12.dp, bottomEnd = 12.dp),
                            modifier = Modifier.fillMaxWidth(0.85f)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.AutoAwesome,
                                        contentDescription = "Sage",
                                        tint = AmberGold,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "CODEX RULES SAGE",
                                        color = AmberGold,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 1.sp
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = msg.text,
                                    color = LightParchment,
                                    fontSize = 11.sp,
                                    lineHeight = 15.sp
                                )
                            }
                        }
                    } else {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF451A03).copy(alpha = 0.5f)),
                            border = BorderStroke(1.dp, Color(0xFF78350F)),
                            shape = RoundedCornerShape(topStart = 12.dp, topEnd = 0.dp, bottomStart = 12.dp, bottomEnd = 12.dp),
                            modifier = Modifier.fillMaxWidth(0.8f)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = msg.text,
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    lineHeight = 15.sp
                                )
                            }
                        }
                    }
                }
            }

            if (isLoading) {
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            color = AmberGold,
                            modifier = Modifier.size(16.dp),
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Consulting the Sacred Mechanicus Cogitator...",
                            color = AmberGold,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        // Bottom text field input
        Card(
            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
            border = BorderStroke(1.dp, GrimDarkBorder),
            shape = RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp, bottomStart = 0.dp, bottomEnd = 0.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = inputQuery,
                    onValueChange = { inputQuery = it },
                    placeholder = { Text("Ask the Rules Sage...", color = SubtleGray, fontSize = 11.sp) },
                    maxLines = 3,
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = LightParchment,
                        focusedBorderColor = AmberGold,
                        unfocusedBorderColor = GrimDarkBorder,
                        focusedContainerColor = GrimDarkBg,
                        unfocusedContainerColor = GrimDarkBg
                    ),
                    textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                IconButton(
                    onClick = {
                        if (inputQuery.isNotBlank() && !isLoading) {
                            viewModel.sendSageMessage(inputQuery)
                            inputQuery = ""
                        }
                    },
                    modifier = Modifier
                        .size(44.dp)
                        .background(if (inputQuery.isBlank()) GrimDarkBorder else AmberGold, RoundedCornerShape(8.dp)),
                    colors = IconButtonDefaults.iconButtonColors(contentColor = Color.Black)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        tint = if (inputQuery.isBlank()) SubtleGray else Color.Black,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}
