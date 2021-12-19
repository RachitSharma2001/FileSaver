from passlib.context import CryptContext

password_context = CryptContext(schemes=["pbkdf2_sha256"], default="pbkdf2_sha256", pbkdf2_sha256__default_rounds=20000)

def encrypt_password(password):
    return password_context.encrypt(password)

def check_password(password, hashed_version):
    return password_context.verify(password, hashed_version)