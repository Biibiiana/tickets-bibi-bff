// tickets.controller.js
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

class TicketsController {
    static async generateTicketPDF(ticketData) {
        try {
            // Crear documento PDF
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'portrait',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });

            // Configurar el fondo azul
            doc.fillColor(96, 165, 250);
            doc.rect(0, 0, 595, 842, 'F');

            // Agregar información del ticket
            doc.fontSize(16);

            doc.text(`Tour: ${ticketData.tourName}`, 110, 60);
            doc.text(`Artista: ${ticketData.artist}`, 110, 80);
            doc.text(`Número de entradas: ${ticketData.nEntradas}`, 110, 140);
            doc.text(`Código de la entrada: ${ticketData.ticketId}`, 110, 160);
            doc.text(`Ubicación: ${ticketData.city}`, 110, 180);
            doc.text(`Fecha del concierto: ${ticketData.date}`, 110, 200);
            doc.fontSize(10);
            doc.text('Condiciones generales de la entrada:', 110, 240);
            doc.text('1. Queda prohibido introducir alcohol, sustancias ilegales, armas u objetos peligrosos al evento.', 110, 270);
            doc.text('2. Admisión, en virtud de lo dispuesto en la Ley de Espectáculos Públicos vigente.', 110, 285);
            doc.text('3. Es importante para todos los asistentes llevar consigo el DNI u otro documento identificativo válido original.', 110, 300);
            doc.text('4. Queda limitada la entrada y/o permanencia en el evento a toda persona que:', 110, 330);
            doc.text('- Se encuentre en estado de embriaguez, porte o consuma cualquier tipo de estupefacientes o cualquier tipo de sustancia ilegal.', 110, 345);
            doc.text('- Porte armas u objetos contundentes, cortantes o potencialmente peligrosos, susceptible de causar daño a personas y/u objetos.', 110, 375);
            doc.text('- Provoque o incite cualquier desorden dentro del evento o haya causado alborotos comprobados.', 110, 405);
            doc.text('5. Todo asistente podrá ser sometido a un registro por el equipo seguridad en el acceso al evento, siguiendo las directrices de Ley de Espectáculos Públicos y Seguridad Privada. En caso de negarse al registro, le será denegada la' +
                'entrada al evento.', 110, 425);
            doc.text('6. Cualquier entrada rota o con indicios de falsificación autorizará al organizador a privar a su portador del acceso al evento.', 110, 465);
            doc.text('7. La organización del evento no se hace responsable de las entradas robadas.', 110, 490);
            doc.text('8. Está terminantemente prohibido grabar, retransmitir y/o filmar el evento con equipo profesional sin permiso previo de la organización.', 110, 505);
            doc.text('9. La organización podrá grabar, retransmitir y filmar el concierto y por tanto también a los asistentes. Con su sola presencia en el mismo, usted reconoce y acepta que su imagen y voz puedan ser fotografiados y registrado, y puedan' +
                'incluirse en el material de archivo que resulte, en formato fotográfico y /o videográfico, para su difusión o transmisión por cualquier medio conocido actualmente o desarrollados en un futuro, a perpetuidad y en todo el universo.', 110, 535);
            doc.text('10. Los menores con 16 y 17 años podrán acceder al evento sin necesidad de ir acompañados de un adulto. Se podrá requerir documentación para acreditar la edad de los asistentes en el acceso al recinto (sólo será válido el DNI' +
                'original) y deberán presentar la siguiente autorización cumplimentada por su padre, madre o tutor legal, junto con una fotocopia de su documento de identidad (DNI).' +
                'Los menores de menores de 16 años podrán acceder al concierto siempre que vengan acompañados por padre, madre o tutor legal, o en su defecto de un adulto responsable, siempre y cuando presenten la siguiente autorización' +
                'cumplimentada por su padre, madre o tutor legal, junto con una fotocopia de su documento de identidad (DNI).', 110, 595);
            doc.text('11. La celebración del espectáculo está sujeta a la normativa establecida por las autoridades competentes y su cumplimiento. Concert Music Festival se reserva el derecho de modificar el aforo y localización de las butacas de cada' +
                'evento, así como denegar el acceso o expulsar del recinto a aquellos clientes que no respeten las normas e indicaciones de la organización, en base a la normativa de seguridad, higiene y salud vigente en cada momento. Todas las' +
                'actualizaciones y cambios serán comunicados por correo electrónico a los compradores.', 110, 690);

            // Convertir a buffer usando Promise
            return new Promise((resolve, reject) => {
                const chunks = [];

                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve(pdfBuffer);
                });

                doc.on('error', (error) => {
                    reject(error);
                });

                doc.end();
            });
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw new Error(`Error al generar el PDF: ${error.message}`);
        }
    }
}

module.exports = TicketsController;