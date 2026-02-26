# DevSnippet IDE 🚀

A realtime packet-based Python decoder interface built with pure JavaScript and Firebase Realtime Database.

DevSnippet simulates a lightweight browser-based IDE where text packets are transmitted, converted to binary, decoded, and executed inside a structured editor UI.

This project focuses on frontend architecture, UI engineering, and realtime event-driven systems.

---

## 🔥 Live Concept

Users can:

- Send text packets (max 200 chars)
- Automatically convert text → binary
- Generate a Python decoder script dynamically
- View realtime incoming packets
- Execute decoding logic with controlled output lifecycle
- See live UI updates via Firebase Realtime Database

---

## 🧠 Core Features

### 1️⃣ Realtime Packet Transmission
Uses Firebase Realtime Database listeners to simulate live network packets.

Example:
- User A sends text
- User B receives binary packet instantly
- Decoder view auto-generates Python script

---

### 2️⃣ Dynamic Python Code Generation
Incoming text is converted to binary and embedded inside:

```python
packet = "01001000 01101001"

def decode_packet(binary):
    chars = binary.split()
    return ''.join(chr(int(b,2)) for b in chars)

print(decode_packet(packet))