import mongoose from 'mongoose'
import validator from 'validator'
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        /* Beachte, die "whitelist" Funktion ist für die Bereinigung. Wir sollten wahrscheinlich die Benutzereingabe für den Benutzernamen nicht ändern, obwohl wir könnten! Erlaube nur alphanumerische Zeichen und Unterstriche*/
        return validator.matches(v, /^[a-zA-Z0-9_]+$/)
      },
      message: (props) => `${props.value} ist kein gültiger Benutzername!`,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v)
      },
      message: (props) => `${props.value} ist keine gültige E-Mail!`,
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 12
      },
      message: (props) => `Kein gültiges Passwort!`,
    },
  },

  biography: {
    type: String,
    validate: {
      validator: function (v) {
        // Überprüfe die Länge
        if (v.length > 200) {
          return false
        }

        // Überprüfe auf HTML-Tags - kein XSS bitte!
        if (v.includes('>') || v.includes('<')) {
          return false
        }

        // Anstatt so zu validieren, könnten wir bereinigen
        // indem wir die schlechten Zeichen automatisch entfernen

        // Gültig!
        return true
      },
      message: (props) => 'Ungültige Biografie!',
    },
    required: true,
  },
})

const userModel = mongoose.model('User', userSchema)

export default userModel
