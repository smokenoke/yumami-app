from pathlib import Path
import sys

from pypdf import PdfReader


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: extract_pdf_text.py <pdf_path>", file=sys.stderr)
        return 1

    pdf_path = Path(sys.argv[1])
    reader = PdfReader(str(pdf_path))
    chunks: list[str] = []
    for page in reader.pages:
        chunks.append(page.extract_text() or "")
    sys.stdout.write("\n".join(chunks))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
