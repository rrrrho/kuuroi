import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import artistPortrait from './assets/mar.jpg'
import workElvis from './assets/elvis.jpeg'
import ferra from './assets/ferra.jpeg'
import nosferatu from './assets/nosferatu.jpeg'
import frank from './assets/frankestein.jpeg'
import silent from './assets/silent.jpeg'
import scissor from './assets/scissor.jpeg'
import chad from './assets/chad.jpeg'
import girl from './assets/girlitalia.jpeg'
import desnuda from './assets/desnuda.jpeg'
import iron from './assets/iron.jpeg'
import escultura from './assets/escultura.jpeg'
import dagas from './assets/dagas.jpeg'
import pareja from './assets/pareja.jpeg'

const works = [
  {
    image: frank,
    year: '2025',
    title: "A LEAF? FOR ME?",
    description: 'Óleo sobre lienzo en medida de 40x40',
    layout: 'work-wide',
  },
  {
    image: silent,
    year: '2025',
    title: 'SILENT HILL III',
    description: 'Óleo sobre lienzo en medida de 50x70',
    layout: 'work-narrow',
  },
  {
    image: scissor,
    year: '2024',
    title: "PICTURE YOU",
    description: 'Óleo sobre lienzo en medida de 40x60',
    layout: 'work-narrow',
  },
  {
    image: workElvis,
    year: '2024',
    title: 'ELVIS',
    description: 'Óleo sobre lienzo en medida de 40x60',
    layout: 'work-wide',
  },
  {
    image: chad,
    year: '2025',
    title: 'STARKER ALS ANGST',
    description: 'Óleo sobre lienzo en medida de 50x70',
    layout: 'work-narrow',
  },
  {
    image: desnuda,
    year: '2026',
    title: 'ESTUDIO DE EDUARDO SÍVORI',
    description: 'Óleo sobre lienzo en medida de 30x40',
    layout: 'work-narrow',
  },
  {
    image: pareja,
    year: '2025',
    title: 'NORMAL PEOPLE',
    description: 'Óleo sobre lienzo en medida de 50x70',
    layout: 'work-narrow',
  },
  {
    image: girl,
    year: '2026',
    title: 'ESTUDIO DE RETRATO A COLOR',
    description: 'Óleo sobre lienzo en medida de 50x70',
    layout: 'work-wide',
  },
  {
    image: ferra,
    year: '2026',
    title: 'ESTUDIO DE FERRAGAMO',
    description: 'Óleo sobre lienzo en medida de 40x60',
    layout: 'work-narrow',
  },
  {
    image: nosferatu,
    year: '2025',
    title: 'NOSFERATU',
    description: 'Grafito sobre papel en medida de 20x30',
    layout: 'work-full',
  },
  {
    image: iron,
    year: '2025',
    title: 'SOMEWHERE IN TIME',
    description: 'Óleo sobre lienzo en medida de 40x40',
    layout: 'work-narrow',
  },
  {
    image: escultura,
    year: '2026',
    title: 'ESTUDIO DE LA GALERÍA DE LA ACADEMIA DE VENECIA',
    description: 'Grafito sobre papel en medida de 30x40',
    layout: 'work-narrow',
  },
  {
    image: dagas,
    year: '2025',
    title: 'PRINCE CNUT',
    description: 'Grafito sobre papel en medida de 30x40',
    layout: 'work-narrow',
  },
]

const CONTACT_FORM_NAME = 'commission-request'
const CONTACT_FORM_WITH_IMAGES_NAME = 'commission-request-with-images'
const MAX_REFERENCE_IMAGES = 6
const MAX_UPLOAD_BYTES = 7 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type InquiryField = 'name' | 'email' | 'details'
type InquiryErrors = Partial<Record<InquiryField, string>>

const getInquiryFieldError = (
  field: InquiryField,
  input: HTMLInputElement | HTMLTextAreaElement,
) => {
  if (!input.value.trim()) {
    if (field === 'name') return 'Ingresá tu nombre para continuar.'
    if (field === 'email') return 'Ingresá tu correo electrónico para continuar.'
    return 'Contanos los detalles o el formato que necesitás.'
  }

  if (field === 'email' && input.validity.typeMismatch) {
    return 'Ingresá un correo electrónico válido.'
  }

  return ''
}

const validateInquiryForm = (form: HTMLFormElement) => {
  const errors: InquiryErrors = {}
  const fields: InquiryField[] = ['name', 'email', 'details']

  fields.forEach((field) => {
    const input = form.elements.namedItem(field)
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
      return
    }

    const error = getInquiryFieldError(field, input)
    if (error) errors[field] = error
  })

  return errors
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.1 2.9c.5 3.2-2.7 4.8-2.2 7.4.2 1 1 1.6 1.8 1.8-.1-1.5.7-2.8 2.1-3.8.1 2.3 3 3.7 3 7.1 0 3.3-2.5 5.6-5.8 5.6s-5.8-2.4-5.8-5.7c0-2.9 1.7-5 3.8-6.8-.2 2.8.7 3.7 1.6 4-1.2-4.3 3.3-5.2 1.5-9.6Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="1" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" />
    </svg>
  )
}

function QuillIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.8 3.8c-4.9-.3-9.6 2.5-11.5 7l-2.8 6.8m2.8-6.8 4.1 4.1m-6.9 2.7 4.7-.5c5.2-.5 9.2-5 9.6-10.2l.2-3.1-3.1.2c-2.7.2-5.2 1.3-7.1 3.1" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.7 2.7 8.1 7 10 4.3-1.9 7-5.3 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.6-4" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 3-8.1 18-2.3-7.6L3 11.1 21 3Z" />
      <path d="m10.6 13.4 4.7-4.7" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
      <path d="M4 14.5V20h16v-5.5" />
    </svg>
  )
}

function ArtworkCard({
  work,
  onOpen,
}: {
  work: (typeof works)[number]
  onOpen: (work: (typeof works)[number]) => void
}) {
  return (
    <article className={`artwork-card ${work.layout}`}>
      <figure className="artwork-visual">
        <img src={work.image} alt="" loading="lazy" decoding="async" />
        <button
          className="artwork-hitarea"
          type="button"
          aria-label={`Ampliar ${work.title}`}
          onClick={() => onOpen(work)}
        >
          <span className="expand-prompt">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.5 3H3v5.5M15.5 21H21v-5.5M3 8.5 9 2.5M21 15.5l-6 6" />
            </svg>
            <span className="expand-label">AMPLIAR IMAGEN</span>
          </span>
        </button>
      </figure>
      <footer className="artwork-details">
        <span>
          <strong>{work.title}</strong>
          <small>{work.description}</small>
        </span>
        <span className="artwork-state">
          <time>{work.year}</time>
        </span>
      </footer>
    </article>
  )
}

function App() {
  const [selectedWork, setSelectedWork] = useState<(typeof works)[number] | null>(
    null,
  )
  const [catalogView, setCatalogView] = useState<'editorial' | 'grid'>(
    'editorial',
  )
  const [referenceImages, setReferenceImages] = useState<
    Array<{ id: string; file: File; url: string }>
  >([])
  const [uploadError, setUploadError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<InquiryErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const referenceImageUrls = useRef<string[]>([])
  const inquiryForm = useRef<HTMLFormElement>(null)
  const contactFormName =
    referenceImages.length > 0
      ? CONTACT_FORM_WITH_IMAGES_NAME
      : CONTACT_FORM_NAME

  useEffect(() => {
    if (!selectedWork) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedWork(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedWork])

  useEffect(
    () => () => {
      referenceImageUrls.current.forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )

  const handleReferenceImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    const files = selectedFiles.filter((file) =>
      ACCEPTED_IMAGE_TYPES.includes(file.type),
    )
    const availableSlots = MAX_REFERENCE_IMAGES - referenceImages.length
    let totalBytes = referenceImages.reduce(
      (total, image) => total + image.file.size,
      0,
    )
    let exceededSize = false

    const acceptedFiles = files.slice(0, availableSlots).filter((file) => {
      if (totalBytes + file.size > MAX_UPLOAD_BYTES) {
        exceededSize = true
        return false
      }

      totalBytes += file.size
      return true
    })

    if (selectedFiles.some((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type))) {
      setUploadError('Solo se admiten imágenes PNG, JPG o WEBP.')
    } else if (files.length > availableSlots) {
      setUploadError(`Podés adjuntar hasta ${MAX_REFERENCE_IMAGES} imágenes.`)
    } else if (exceededSize) {
      setUploadError('Las imágenes no pueden superar 7 MB en total.')
    } else {
      setUploadError('')
    }

    const nextImages = acceptedFiles.map((file, index) => {
      const url = URL.createObjectURL(file)
      referenceImageUrls.current.push(url)
      return {
        id: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${index}`,
        file,
        url,
      }
    })

    setReferenceImages((current) => [...current, ...nextImages])
    event.target.value = ''
  }

  const removeReferenceImage = (id: string) => {
    setReferenceImages((current) => {
      const image = current.find((item) => item.id === id)
      if (image) {
        URL.revokeObjectURL(image.url)
        referenceImageUrls.current = referenceImageUrls.current.filter(
          (url) => url !== image.url,
        )
      }
      return current.filter((item) => item.id !== id)
    })
    setUploadError('')
  }

  const clearReferenceImages = () => {
    referenceImages.forEach((image) => URL.revokeObjectURL(image.url))
    referenceImageUrls.current = []
    setReferenceImages([])
    setUploadError('')
  }

  const handleInquiryFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const field = event.currentTarget.name as InquiryField
    if (!fieldErrors[field]) return

    const error = getInquiryFieldError(field, event.currentTarget)
    setFieldErrors((current) => {
      const nextErrors = { ...current }
      if (error) nextErrors[field] = error
      else delete nextErrors[field]
      return nextErrors
    })
  }

  const handleInquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitState === 'submitting') return

    const form = event.currentTarget
    const errors = validateInquiryForm(form)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setSubmitMessage('')
      const firstInvalidField = Object.keys(errors)[0]
      const firstInvalidInput = form.elements.namedItem(firstInvalidField)
      if (
        firstInvalidInput instanceof HTMLInputElement ||
        firstInvalidInput instanceof HTMLTextAreaElement
      ) {
        firstInvalidInput.focus()
      }
      return
    }

    setFieldErrors({})
    const formData = new FormData(form)

    formData.set('form-name', contactFormName)

    referenceImages.forEach((image, index) => {
      formData.append(
        `reference_image_${index + 1}`,
        image.file,
        image.file.name,
      )
    })

    setSubmitState('submitting')
    setSubmitMessage('Enviando tu consulta...')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) throw new Error('Netlify rejected the form submission')

      form.reset()
      clearReferenceImages()
      setSubmitState('success')
      setSubmitMessage('Tu consulta fue enviada correctamente.')
    } catch {
      setSubmitState('error')
      setSubmitMessage(
        'No pudimos enviar la consulta. Revisá tu conexión e intentá nuevamente.',
      )
    }
  }

  return (
    <main className="page-shell" id="inicio">
      <header className="site-header">
        <div className="header-inner">
          <div className="wordmark" aria-label="Kuuroi">
            KUUROI
          </div>

          <nav className="main-nav" aria-label="Navegación principal">
            <a href="#sobre-la-artista">SOBRE LA ARTISTA</a>
            <a href="#obras">OBRAS</a>
            <a href="#contacto">CONTACTO</a>
          </nav>

          <a className="commission-button" href="#contacto">
            <MailIcon />
            <span>COMISIONES</span>
          </a>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="ambient-art" aria-hidden="true">
          <span className="shadow shadow-one" />
          <span className="shadow shadow-two" />
          <span className="shadow shadow-three" />
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            <FlameIcon />
            <span>ATELIER DE ARTE GÓTICO - PINTURAS E ILUSTRACIONES REALISTAS</span>
          </div>

          <h1 id="hero-title">
            <span>ARTE QUE MANIFIESTA</span>
            <span>
              LA <em>INMORTALIDAD</em><b>.</b>
            </span>
          </h1>

          <p className="hero-quote">Proveniente de mi amor y mi reflejo.</p>

          <p className="hero-description">
            Obras al óleo sobre lienzo e ilustraciones tradicionales
            <br />
            realizadas con grafito. Técnicas de claroscuro y grisaille.
          </p>

          <div className="hero-actions" aria-label="Acciones destacadas">
            <a className="primary-action" href="#obras">
              <span>VER COLECCIÓN DE OBRAS</span>
              <ArrowIcon />
            </a>
            <a className="secondary-action" href="#sobre-la-artista">
              SOBRE LA ARTISTA
            </a>
          </div>

          <div className="memento" aria-label="Memento mori">
            <span className="line" />
            <span className="diamond">♦</span>
            <span>MEMENTO MORI</span>
            <span className="diamond">♦</span>
            <span className="line" />
          </div>
        </div>
      </section>

      <section
        className="about-section"
        id="sobre-la-artista"
        aria-labelledby="about-title"
      >
        <div className="about-inner">
          <header className="about-heading">
            <span>CAPÍTULO I · DUOMO</span>
            <h2 id="about-title">SOBRE LA ARTISTA</h2>
          </header>

          <div className="about-grid">
            <div className="artist-column">
              <figure className="artist-portrait">
                <img
                  src={artistPortrait}
                  alt="Retrato de la artista en su atelier"
                />
                <figcaption>
                  <span>Retrato tomado en Florencia, Italia</span>
                  <span>Circa 2026</span>
                </figcaption>
              </figure>

              <div className="atelier-card">
                <strong>ATELIER</strong>
                <span>Buenos Aires, Argentina.</span>
              </div>
            </div>

            <div className="artist-story">
              <blockquote>
                «KUUROI es el reflejo de mi esencia y mi manera de inmortalizar
                una emoción interna. Crear una proyección artística trabajada
                con pinceladas sumamente expresivas es mi propósito.»
              </blockquote>

              <div className="biography">
                <p>
                  Mi arte se encuentra influenciado por mis pasiones a lo largo
                  de mi desarrollo.
                </p>
                <p>
                  Grandes referentes como Takehiko Inoue influyeron en mis
                  comienzos como artista junto a pintores como Eduardo Sívori y
                  referentes internacionales del expresionismo tradicional.
                </p>
                <p>
                  Mi formación académica en Florencia, Italia permitió
                  profundizarme en el arte académico de los maestros de la
                  Antigua Academia y mi técnica consiste en manejo de
                  claroscuro, grisaille y grafito.
                </p>
                <p>
                  Expuse en centros de galerías, hoteles, teatros y
                  convenciones en la ciudad de Buenos Aires y Córdoba.
                </p>
                <p>
                  Siempre pensando en vivo o exponiendo las creaciones del
                  momento presente.
                </p>
              </div>

              <aside className="recognition-card">
                <strong>CLAROSCURO TENEBRISTA</strong>
                <span>Concurso temático homenaje de Eduardo Sívori.</span>
              </aside>

              <div className="exhibitions">
                <h3>EXPOSICIONES &amp; SALONES SELECTOS</h3>
                <ol>
                  <li>
                    <time>2023</time>
                    <span>«Open Gallery Y Fungi Techno»</span>
                  </li>
                  <li>
                    <time>2024</time>
                    <span>«Comic Con Argentina»</span>
                  </li>
                  <li>
                    <time>2024</time>
                    <span>«Open Gallery Y Grand Brizo Buenos Aires»</span>
                  </li>
                  <li>
                    <time>2024</time>
                    <span>«Open Gallery Y Conviverse»</span>
                  </li>
                  <li>
                    <time>2025</time>
                    <span>«Hostería El Durazno»</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="works-section" id="obras" aria-labelledby="works-title">
        <div className="works-inner">
          <header className="works-header">
            <div className="works-heading">
              <span>CAPÍTULO II · CATÁLOGO DEL ATELIER</span>
              <h2 id="works-title">TRABAJOS &amp; OBRAS</h2>
              <p>
                Colección permanente de lienzos. Selección de obras de arte,
                estudios realizados y comisiones personalizadas a pedido.
              </p>
            </div>

            <div className="catalog-controls" aria-label="Controles del catálogo">
              <div className="view-group" aria-label="Vista del catálogo">
                <button
                  className={catalogView === 'editorial' ? 'is-active' : undefined}
                  type="button"
                  aria-label="Vista editorial"
                  aria-pressed={catalogView === 'editorial'}
                  onClick={() => setCatalogView('editorial')}
                >
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <rect x="2" y="2" width="5" height="14" />
                    <rect x="10" y="2" width="6" height="14" />
                  </svg>
                </button>
                <button
                  className={catalogView === 'grid' ? 'is-active' : undefined}
                  type="button"
                  aria-label="Vista en grilla"
                  aria-pressed={catalogView === 'grid'}
                  onClick={() => setCatalogView('grid')}
                >
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <rect x="2" y="2" width="5" height="5" />
                    <rect x="11" y="2" width="5" height="5" />
                    <rect x="2" y="11" width="5" height="5" />
                    <rect x="11" y="11" width="5" height="5" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div
            className={`artworks-grid${catalogView === 'grid' ? ' is-grid' : ''}`}
          >
            {works.map((work) => (
              <ArtworkCard key={work.title} work={work} onOpen={setSelectedWork} />
            ))}
          </div>

        </div>
      </section>

      <section
        className="contact-section"
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className="contact-inner">
          <header className="contact-heading">
            <span>CAPÍTULO III · ESTUDIO DE ARTE</span>
            <h2 id="contact-title">CONTACTO</h2>
            <p>Para entregas de pedidos personalizados.</p>
          </header>

          <div className="contact-grid">
            <form
              ref={inquiryForm}
              className="inquiry-card"
              name={contactFormName}
              method="POST"
              encType="multipart/form-data"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              aria-label="Consulta de obra"
              noValidate
              onSubmit={handleInquirySubmit}
            >
              <input type="hidden" name="form-name" value={contactFormName} />
              <input
                type="hidden"
                name="subject"
                value="Nueva consulta desde KUUROI"
              />
              <label className="honeypot-field" aria-hidden="true">
                No completar
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>

              <div className="form-intro">
                <div>
                  <QuillIcon />
                  <h3>DESPACHO DE CORRESPONDENCIA</h3>
                </div>
                <p>Completar los datos para reservar una obra de arte.</p>
              </div>

              <div className="form-fields">
                <label>
                  <span>SOLICITANTE <b>*</b></span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    onChange={handleInquiryFieldChange}
                    required
                  />
                  {fieldErrors.name && (
                    <small className="field-error" id="name-error" role="alert">
                      {fieldErrors.name}
                    </small>
                  )}
                </label>

                <label>
                  <span>CORREO ELECTRÓNICO <b>*</b></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    onChange={handleInquiryFieldChange}
                    required
                  />
                  {fieldErrors.email && (
                    <small className="field-error" id="email-error" role="alert">
                      {fieldErrors.email}
                    </small>
                  )}
                </label>

                <label>
                  <span>CONSULTA</span>
                  <span className="select-field">
                    <select name="inquiry_type" defaultValue="adquisicion">
                      <option value="adquisicion">Adquisición de Lienzo al Óleo</option>
                      <option value="comision">Comisión personalizada</option>
                      <option value="informacion">Información sobre una obra</option>
                    </select>
                  </span>
                </label>

                <label>
                  <span>LIENZO DE REFERENCIA O ASUNTO</span>
                  <input
                    type="text"
                    name="artwork_reference"
                    placeholder="Ej. Obra de Edward Scissorhands"
                  />
                </label>

                <div className="upload-field">
                  <span className="upload-label">IMÁGENES DE REFERENCIA</span>
                  <label
                    className={`upload-dropzone${uploadError ? ' is-invalid' : ''}`}
                  >
                    <input
                      className="upload-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      disabled={
                        referenceImages.length >= MAX_REFERENCE_IMAGES ||
                        submitState === 'submitting'
                      }
                      onChange={handleReferenceImages}
                    />
                    <UploadIcon />
                    <span>
                      <strong>ADJUNTAR IMÁGENES</strong>
                      <small>PNG, JPG o WEBP · hasta 6 imágenes / 7 MB</small>
                    </span>
                  </label>

                  {uploadError && (
                    <small className="upload-error" role="alert">
                      {uploadError}
                    </small>
                  )}

                  {referenceImages.length > 0 && (
                    <>
                      <div className="upload-summary">
                        <span>
                          {referenceImages.length}{' '}
                          {referenceImages.length === 1 ? 'imagen adjunta' : 'imágenes adjuntas'}
                        </span>
                        <button type="button" onClick={clearReferenceImages}>
                          QUITAR TODAS
                        </button>
                      </div>
                      <div
                        className={`upload-previews${referenceImages.length === 1 ? ' is-single' : ''}`}
                      >
                        {referenceImages.map((image) => (
                          <figure className="upload-preview" key={image.id}>
                            <img
                              src={image.url}
                              alt={`Vista previa de ${image.file.name}`}
                            />
                            <figcaption title={image.file.name}>
                              {image.file.name}
                            </figcaption>
                            <button
                              type="button"
                              aria-label={`Quitar ${image.file.name}`}
                              onClick={() => removeReferenceImage(image.id)}
                            >
                              ×
                            </button>
                          </figure>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <label>
                  <span>FORMATO <b>*</b></span>
                  <textarea
                    name="details"
                    placeholder="Dimensiones deseadas, técnica, soporte o detalles del encargo..."
                    aria-invalid={Boolean(fieldErrors.details)}
                    aria-describedby={fieldErrors.details ? 'details-error' : undefined}
                    onChange={handleInquiryFieldChange}
                    required
                  />
                  {fieldErrors.details && (
                    <small className="field-error" id="details-error" role="alert">
                      {fieldErrors.details}
                    </small>
                  )}
                </label>
              </div>

              <button
                className="dispatch-button"
                type="submit"
                disabled={submitState === 'submitting'}
              >
                <SendIcon />
                <span>
                  {submitState === 'submitting'
                    ? 'DESPACHANDO MISIVA...'
                    : 'SELLAR Y DESPACHAR MISIVA'}
                </span>
              </button>

              {submitMessage && (
                <p
                  className={`form-status is-${submitState}`}
                  role={submitState === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                >
                  {submitMessage}
                </p>
              )}

              <small className="form-disclaimer">
                Toda correspondencia se maneja con estricta confidencialidad artesanal.
              </small>
            </form>

            <div className="contact-asides">
              <aside className="coordinates-card">
                <h3>COORDENADAS DEL ATELIER</h3>
                <div className="contact-detail">
                  <MailIcon />
                  <span>
                    <small>MAIL DE CONSULTAS DE TRABAJO</small>
                    <strong>kuuroi882@gmail.com</strong>
                  </span>
                </div>
                <div className="contact-detail">
                  <PinIcon />
                  <span>
                    <small>SEDE DEL ATELIER</small>
                    <strong>Buenos Aires, Argentina.</strong>
                  </span>
                </div>
              </aside>

              <aside className="protocol-card">
                <div className="protocol-title">
                  <ShieldIcon />
                  <h3>PROTOCOLO DE ENCARGOS AL ÓLEO</h3>
                </div>
                <p>
                  <strong>Período de Curado:</strong> De 2 semanas en adelante
                  dependiendo la técnica aplicada.
                </p>
                <p>
                  <strong>Embalaje &amp; Envío Seguro:</strong> Las obras adquiridas
                  se envían y entregan envueltas sobre papel burbuja y en cartón
                  protector.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-signature">
            <strong>KUUROI</strong>
            <small>Todos los derechos reservados · 2026</small>
          </div>
          <a className="back-to-top" href="#inicio">
            CIMA <span>↑</span>
          </a>
        </div>
      </footer>

      {selectedWork &&
        createPortal(
          <div
            className="artwork-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedWork.title}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedWork(null)
            }}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Cerrar imagen ampliada"
              autoFocus
              onClick={() => setSelectedWork(null)}
            >
              ×
            </button>
            <figure className="modal-artwork">
              <img src={selectedWork.image} alt="" />
              <figcaption>
                <strong>{selectedWork.title}</strong>
                <time>{selectedWork.year}</time>
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </main>
  )
}

export default App
