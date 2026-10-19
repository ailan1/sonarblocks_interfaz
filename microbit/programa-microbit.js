/**
 * SonarBlocks — Programa de la micro:bit (Robo:bit / Ring:bit car)
 *
 * Cómo cargarlo:
 *   1. Abrir https://makecode.microbit.org y el proyecto actual de SonarBlocks
 *      (tiene que tener las extensiones Bluetooth y RingbitCar).
 *   2. Pasar a la vista "JavaScript", borrar todo y pegar este archivo.
 *   3. Descargar el .hex y copiarlo a la micro:bit.
 *
 * La app web manda un comando por línea (texto + "\n") por Bluetooth UART.
 * Cada comando de acá tiene que coincidir con el campo "codigo" de
 * src/datos/bloquesData.js (hay un test que lo controla: App.test.js).
 *
 * Los bloques Repetir y Fin de repetir NO llegan a la placa: la app
 * despliega la repetición y manda los comandos uno por uno.
 */

let comando = ""
let nivelLuz = 0
let Tiempo = 0

// --- EVENTOS DE CONEXIÓN ---
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
    bluetooth.uartWriteString("Ready\n")
    music.play(music.createSoundExpression(WaveShape.Sine, 1500, 1500, 255, 255, 1000, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})

bluetooth.onBluetoothDisconnected(function () {
    // CAMBIO: si se corta el Bluetooth, el robot se frena (antes podía seguir andando)
    RingbitCar.brake()
    basic.showIcon(IconNames.Sad)
})

// --- INTÉRPRETE DE COMANDOS (uno por línea, desde la app) ---
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    comando = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

    // Movimiento
    if (comando == "move_forward") {
        RingbitCar.running_distance(RingbitCar.Direction_run.forward, 40)
    } else if (comando == "turn_left") {
        RingbitCar.steering_angle(RingbitCar.Direction_turn.left, 90)
    } else if (comando == "turn_right") {
        RingbitCar.steering_angle(RingbitCar.Direction_turn.right, 90)

    // Acciones
    } else if (comando == "wait") {
        // La espera la marca la app (2 segundos por bloque): acá no hace falta nada
    } else if (comando == "play_tone") {
        // Bloque "Bip"
        music.playTone(262, music.beat(BeatFraction.Whole))

    // Luces
    } else if (comando == "show_icon_heart") {
        // Bloque "Corazón"
        basic.showIcon(IconNames.Heart)
    } else if (comando == "show_icon_cross") {
        // Bloque "Cruz"
        basic.showIcon(IconNames.No)
    } else if (comando == "clear_screen") {
        // Bloque "Apagar luces"
        basic.clearScreen()

    // Comandos del modo "auto" (la app básica todavía no los usa)
    } else if (comando == "show_text") {
        basic.showString("HOLA")
    } else if (comando == "play_melody") {
        music.startMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once)
    } else if (comando == "luz") {
        nivelLuz = input.lightLevel()
        bluetooth.uartWriteString("Luz: " + nivelLuz + "\n")
    } else if (comando == "SeguirLinea") {
        // CAMBIO: Tiempo se pone en 0 al empezar (si no, la segunda vez no sigue la
        // línea) y el bucle hace una pausa corta en cada vuelta. Sin esa pausa la
        // placa no tiene tiempo de sumar "Tiempo" y el bucle puede no terminar nunca.
        Tiempo = 0
        while (Tiempo < 10) {
            if (RingbitCar.tracking(RingbitCar.TrackingStateType.Tracking_State_2)) {
                RingbitCar.freestyle(100, 0)
                basic.pause(100)
            }
            if (RingbitCar.tracking(RingbitCar.TrackingStateType.Tracking_State_1)) {
                RingbitCar.freestyle(0, 100)
                basic.pause(100)
            }
            RingbitCar.freestyle(80, 80)
            basic.pause(20)
        }
        RingbitCar.brake()

    } else {
        // CAMBIO: si llega un comando que no conoce, lo avisa a la app (ayuda a encontrar errores)
        bluetooth.uartWriteString("Desconocido: " + comando + "\n")
    }
})

// --- INICIO ---
Tiempo = 0
music.play(music.createSoundExpression(WaveShape.Sine, 200, 1200, 255, 255, 1000, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
RingbitCar.init_wheel(AnalogPin.P1, AnalogPin.P2)
RingbitCar.running_time(RingbitCar.Direction_run.forward, 0.05)
bluetooth.startUartService()

// Cuenta el tiempo para SeguirLinea (+1 cada 200 ms → 10 = 2 segundos)
loops.everyInterval(200, function () {
    Tiempo = Tiempo + 1
})
