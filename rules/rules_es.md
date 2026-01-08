# Manual de reglas

Bienvenido. Este es un juego de batallas tácticas de fantasía que utiliza el sistema de mando por cartas y combate con dados de la saga *Command & Colors*, fusionado con una mecánica de bloques rotativos para gestionar la salud y la niebla de guerra.

## Componentes del juego

* **Tablero Hexagonal:** Dividido en tres secciones: flanco izquierdo, centro y flanco derecho.
* **Bloques de Unidad:** Cuadrados y rectángulos de madera o plástico, de color sólido (azul, verde, rojo, gris, etc...) según la facción.
* **Mazo de Mando:** 50 cartas que permiten activar unidades.
* **Dados de Combate:** Dados de 6 caras con símbolos: espada, bandera, escudo y magia/casco.
* **Fichas de Maná (💧):** Para ejecutar poderosos hechizos.

## Los bloques y la niebla de guerra

A diferencia de otros juegos, los bloques se colocan "de pie" mirando hacia su dueño. El oponente solo ve bloques de un color sólido, sin saber qué unidad se oculta detrás hasta que se produce un combate o reconocimiento.

### Mecánica de Fuerza rotativa

Cada unidad tiene un valor de **Fuerza (F)** que indica cuántos dados lanza en combate.

* El valor de Fuerza actual es el número que aparece en el **borde superior** del bloque.
* Cuando una unidad recibe daño, el bloque se gira 90° hacia la izquierda para mostrar el nuevo valor inferior.
* Si una unidad con Fuerza 1 recibe un daño, es eliminada del tablero.

## Secuencia de juego

El juego se desarrolla en turnos alternos. En cada turno, el jugador activo sigue estos pasos:

1. **Generación de maná:** Gana 1 💧 por cada Altar bajo tu control.
2. **Jugar una carta de mando:** Selecciona una carta de tu mano y colócala en la mesa.
3. **Anunciar activaciones:** Indica qué unidades vas a mover y atacar según las instrucciones de la carta.
4. **Movimiento:** Mueve las unidades activadas una a una.
5. **Combate:** Resuelve los ataques de las unidades activadas.
6. **Robar carta:** Descarta la carta jugada y roba una nueva del mazo.

## Movimiento

Cada unidad tiene un valor de movimiento en su ficha técnica.

* El terreno puede detener o ralentizar el avance (ver Tabla de terreno).
* **Carga impetuosa:** Las unidades **pesadas** que muevan 2 o más hexágonos antes de atacar ganan +1 dado en melé e ignoran la primera bandera de retirada recibida ese turno.

## Los dados de combate y armaduras

El sistema de combate se basa en la interacción entre los símbolos del dado y el tipo de unidad objetivo.

### Distribución de las caras (Probabilidad 1/6 cada una)

| Cara | Símbolo | Efecto táctico |
| --- | --- | --- |
| **1** | **Espada (⚔️)** | **Impacto universal**: Daña a cualquier tipo de unidad. |
| **2** | **Bandera (🚩)** | **Retirada**: El defensor retrocede 1 hexágono hacia su borde del mapa. |
| **3** | **Círculo Verde (🟢)** | **Impacto ligero**: Solo daña a unidades de tipo **ligera**. |
| **4** | **Triángulo Azul (🔵)** | **Impacto medio**: Solo daña a unidades de tipo **media**. |
| **5** | **Cuadrado Rojo (🔴)** | **Impacto pesado**: Solo daña a unidades de tipo **pesada**. |
| **6** | **Magia / Casco (💧)** | **Recurso**: El atacante elige ganar 1 💧 de Maná o hacer 1 daño (si tiene habilidad de casco). |

### El sistema de impactos por tipo

Para infligir daño, el símbolo obtenido debe coincidir con la categoría de la unidad defensora:

* **Unidades ligeras (verde)**: Reciben daño con ⚔️ y 🟢.
* **Unidades medias (azul)**: Reciben daño con ⚔️ y 🔵.
* **Unidades pesadas (rojo)**: Reciben daño con ⚔️ y 🔴.
* **Unidades élite**: Generalmente **solo** reciben daño con ⚔️ (las caras de colores son fallos contra ellas).

## Combate

El combate se resuelve lanzando dados. El número de dados depende del tipo de ataque:

### Cuerpo a cuerpo (melé)

Se realiza contra una unidad enemiga adyacente. El atacante lanza tantos dados como su **fuerza actual**.

### A distancia (rango)

Utiliza la regla decreciente: **dados = fuerza - (distancia en hexágonos - 1)**.

> *Ejemplo:* Una unidad con F3 dispara a un objetivo a 3 hexágonos de distancia. Lanza 1 dado (3 de Fuerza - 2 de penalización por distancia).

### Símbolos de los dados

* **Espada:** Un impacto. El defensor rota su bloque un nivel hacia abajo.
* **Bandera:** Retirada. El defensor debe retroceder un hexágono hacia su borde del tablero por cada bandera obtenida.
* **Escudo:** Impacto solo si coincide con el tipo de unidad (Ligera, Media o Pesada).
* **Magia/Casco:** El atacante elige entre hacer 1 punto de daño O ganar **1 💧 de Maná** para su reserva.

## Magia

### El sistema de maná (💧)

Puedes acumular hasta un máximo de **5 💧** en tu reserva. Se utiliza para activar la **Opción A** de las cartas de Hechizo. Si no tienes maná, puedes usar la **Opción B** de la carta como un movimiento convencional.

### Héroes y titanes

Estas unidades son legendarias y poseen **Reglas especiales** especificadas en su ficha de unidad o descritas en el escenario.

## Tabla de referencia de terreno

| Terreno | Efecto movimiento | Efecto combate | Visión |
| --- | --- | --- | --- |
| **Bosque** | Detiene el movimiento al entrar. | Defensor resta 1 dado recibido. | Bloqueada. |
| **Colina** | Coste de entrada +1. | Atacante desde arriba gana +1 dado. | Pasa por encima. |
| **Río** | Solo se puede cruzar por puentes o vados. | Atacante desde el agua resta -2 dados. | No bloquea. |
| **Altar** | Movimiento normal. | Genera +1 💧 de Maná al inicio del turno. | No bloquea. |
| **Ruinas** | Movimiento normal. | La Infantería gana +1 dado en defensa. | Bloqueada. |

## Ejemplo de juego

**Situación:** El jugador Humano juega una carta de *Ataque al Flanco Derecho*. Activa a sus **Caballeros (Pesada, F4)**.

1. **Movimiento:** Los Caballeros mueven 3 hexágonos hacia un grupo de Orcos. Al mover más de 2 hexes, ganan el bono de **Carga impetuosa**.
2. **Combate:** Atacan con 5 dados (4 de Fuerza + 1 por el bono de carga).
3. **Resultado:** Obtienen: ⚔️, ⚔️, 🚩, 🛡️, 💧.
* Los Orcos reciben 2 daños (rotan su bloque 2 veces).
* La bandera (🚩) obliga a los Orcos a retirarse un hexágono.
* El jugador Humano elige ganar 1 punto de Maná (💧) para su reserva.