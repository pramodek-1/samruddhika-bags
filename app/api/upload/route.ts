import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      console.error(`Upload error: Invalid file type ${file.type}`);
      return NextResponse.json(
        { error: `Invalid file type ${file.type}. Only JPG, PNG and PDF files are allowed` },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error(`Upload error: File too large ${file.size} bytes`);
      return NextResponse.json(
        { error: `File size too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `payment-slip-${uniqueSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Upload error: Failed to create uploads directory', err);
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    const filepath = join(uploadDir, filename);
    
    try {
      // Write file using Uint8Array
      await writeFile(filepath, new Uint8Array(buffer.buffer));
      
      // Return the URL that can be used to access the file
      const fileUrl = `/uploads/${filename}`;
      console.log('File uploaded successfully:', fileUrl);
      return NextResponse.json({ url: fileUrl });
    } catch (writeError) {
      console.error('Upload error: Failed to write file', writeError);
      return NextResponse.json(
        { error: 'Failed to save file. Please try again or contact support.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file. Please try again or contact support.' },
      { status: 500 }
    );
  }
} 