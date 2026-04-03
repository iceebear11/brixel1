import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const settings = await Settings.find();
    
    // Default fallback settings
    const defaultSettings = {
      delivery_charge_dhaka: 80,
      delivery_charge_outside: 150,
      contact_phone: '+880123456789',
      contact_email: 'support@materiqo.com',
      store_address: 'Dhaka, Bangladesh',
      facebook_link: 'https://facebook.com/materiqo',
      bkash_number: '01XXXXXXXXX',
      nagad_number: '01XXXXXXXXX',
    };

    const formattedSettings = {};
    settings.forEach(s => {
      formattedSettings[s.key] = s.value;
    });

    return NextResponse.json({ ...defaultSettings, ...formattedSettings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = getUserFromRequest(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { key, value } = await request.json();
    await dbConnect();
    
    await Settings.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
