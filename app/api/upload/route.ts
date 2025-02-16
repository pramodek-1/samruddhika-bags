import { NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG and PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `payment-slip-${uniqueSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      // Check if directory exists
      try {
        await access(uploadDir);
      } catch {
        // Directory doesn't exist, create it
        console.log('Creating uploads directory:', uploadDir);
        await mkdir(uploadDir, { recursive: true });
      }
      
      const filepath = join(uploadDir, filename);
      console.log('Writing file to:', filepath);
      
      // Write file
      await writeFile(filepath, buffer);
      
      console.log('File written successfully');
      
      // Return the URL that can be used to access the file
      return NextResponse.json({ 
        url: `/uploads/${filename}` 
      });
    } catch (error) {
      console.error('File system error:', error);
      return NextResponse.json(
        { error: `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 