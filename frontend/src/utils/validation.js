import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './config';

// Normalize Romanian characters to ASCII equivalents
export const normalizeRomanianChars = (text) => {
  if (!text) return text;
  
  return text
    .replace(/[ăĂ]/g, 'a')
    .replace(/[âÂ]/g, 'a')
    .replace(/[îÎ]/g, 'i')
    .replace(/[șȘ]/g, 's')
    .replace(/[țȚ]/g, 't');
};

export const validateEmail = (email) => {
  // More robust email validation
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email) && email.length <= 254;
};

export const validatePhone = (phone) => {
  // Allow 10 digits with or without +4 prefix, more strict validation
  const cleaned = phone.replace(/\s/g, '');
  const re = /^(\+40)?[0-9]{9,10}$/;
  return re.test(cleaned);
};

export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // First normalize Romanian characters
  let sanitized = normalizeRomanianChars(input);
  
  // Then apply other sanitization
  return sanitized
    .replace(/[<>]/g, '')
    .replace(/['"]/g, '') // Add quotes
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\${.*}/g, '') // Template literals
    .substring(0, 500);
};

export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'Nu ați selectat niciun fișier' };
  
  // File size check
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Fișierul depășește 5MB' };
  }
  
  // Minimum file size check (prevent empty files)
  if (file.size < 100) {
    return { valid: false, error: 'Fișierul este prea mic sau corupt' };
  }
  
  // File type check
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tip de fișier neacceptat. Folosiți PDF, JPG sau PNG' };
  }
  
  // Check file name for suspicious patterns
  const fileName = file.name.toLowerCase();
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\') ||
      fileName.includes('\0') || fileName.startsWith('.') || fileName.includes('<') ||
      fileName.includes('>') || fileName.length > 255) {
    return { valid: false, error: 'Nume de fișier invalid' };
  }
  
  // Check for suspicious file extensions even if MIME type is correct
  const suspiciousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js'];
  const hasExtension = suspiciousExtensions.some(ext => fileName.endsWith(ext));
  if (hasExtension) {
    return { valid: false, error: 'Extensie de fișier interzisă' };
  }
  
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Numele trebuie să aibă cel puțin 2 caractere' };
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Numele este prea lung' };
  }
  
  // Updated regex to still allow Romanian characters for validation (display)
  // but they will be normalized when sent to backend
  const nameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Numele conține caractere nevalide' };
  }
  
  return { valid: true };
};

export const validateDate = (dateString) => {
  if (!dateString) {
    return { valid: false, error: 'Data este obligatorie' };
  }
  
  const date = new Date(dateString);
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, 0, 1);
  const maxDate = new Date(today.getFullYear() - 5, 11, 31);
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Dată invalidă' };
  }
  
  if (date < minDate || date > maxDate) {
    return { valid: false, error: 'Data nașterii trebuie să fie între 5 și 100 de ani în urmă' };
  }
  
  return { valid: true };
};

// Rate limiting helper for client-side
let requestCount = 0;
let lastRequestTime = Date.now();

export const checkRateLimit = () => {
  const now = Date.now();
  const timeDiff = now - lastRequestTime;
  
  // Reset counter if more than 1 minute has passed
  if (timeDiff > 60000) {
    requestCount = 0;
  }
  
  if (requestCount >= 3) { // Client-side limit of 3 requests per minute
    return { allowed: false, error: 'Prea multe cereri. Încercați din nou peste un minut.' };
  }
  
  requestCount++;
  lastRequestTime = now;
  return { allowed: true };
};

// Security helper to detect potential XSS
export const detectXSS = (input) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};