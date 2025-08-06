"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (
    !value.endsWith("@alumnos.ubiobio.cl") &&
    !value.endsWith("@ubiobio.cl") &&
    !value.endsWith("@gmail.com")
  ) {
    return helper.message(
      "El correo electrónico debe finalizar en @alumnos.ubiobio.cl, @ubiobio.cl o @gmail.com."
    );
  }
  return value;
};

export const emailValidation = Joi.object({

  fromName: Joi.string()
    .min(5)
    .max(15)
    .required()
    .messages({
      "string.empty": "El nombre del remitente no puede estar vacío.",
      "any.required": "El nombre del remitente es obligatorio.",
      "string.base": "El nombre del remitente debe ser de tipo texto.",
      "string.min": "El nombre del remitente debe tener al menos 5 caracteres.",
      "string.max": "El nombre del remitente debe tener como máximo 15 caracteres.",
    }),

  email: Joi.string()
    .required()
    .custom((value, helpers) => {
      // Divide la cadena de correos y valida cada uno individualmente
      const emails = value.split(',').map(e => e.trim()).filter(e => e);

      if (emails.length === 0) {
        return helpers.message("El correo del destinatario no puede estar vacío.");
      }

      for (const email of emails) {
        // Valida el formato de email básico para cada correo
        const { error: emailFormatError } = Joi.string().email().validate(email);
        if (emailFormatError) {
          return helpers.message(`El formato del correo '${email}' es inválido.`);
        }
      }

      // Aplica la validación de dominio personalizada a la cadena completa
      return domainEmailValidator(value, helpers);
    }, "Validación de múltiples correos y dominio")
    .messages({
        "string.empty": "El correo del destinatario no puede estar vacío.",
        "any.required": "El correo del destinatario es obligatorio.",
        "string.base": "El correo del destinatario debe ser de tipo texto.",
    }),

  subject: Joi.string()
    .min(5)
    .max(15)
    .required()
    .messages({
      "string.empty": "El asunto no puede estar vacío.",
      "any.required": "El asunto es obligatorio.",
      "string.base": "El asunto debe ser de tipo texto.",
      "string.min": "El asunto debe tener al menos 5 caracteres.",
      "string.max": "El asunto debe tener como máximo 100 caracteres.",
    }),

  message: Joi.string()
    .allow("")
    .messages({
      "string.base": "El cuerpo del mensaje debe ser de tipo texto.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales en el formulario.",
});

export const urlValidation = Joi.object({

    name: Joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.empty": "El nombre de la página no puede estar vacío.",
      "any.required": "El nombre de la página es obligatorio.",
      "string.base": "El nombre de la página debe ser de tipo texto.",
      "string.min": "El nombre de la página debe tener al menos 3 caracteres.",
      "string.max": "El nombre de la página debe tener como máximo 25 caracteres.",
    }),

    url: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "La URL no puede estar vacía.",
      "any.required": "La URL es obligatoria.",
      "string.base": "La URL debe ser de tipo texto.",
      "string.uri": "La URL debe ser una URL válida.",
    }),

}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales en el formulario.",
});