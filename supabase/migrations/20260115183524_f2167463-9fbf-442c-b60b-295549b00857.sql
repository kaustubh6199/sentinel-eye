-- Update handle_new_user function to make first user an admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
  user_count INTEGER;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Check if there's an invitation for this email
  SELECT * INTO invitation_record 
  FROM public.invitations 
  WHERE email = NEW.email AND status = 'pending';
  
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- If this is the first user, make them an admin
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  -- Otherwise if invitation exists, assign the invited role
  ELSIF invitation_record.id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, invitation_record.role);
    
    -- Mark invitation as accepted
    UPDATE public.invitations 
    SET status = 'accepted' 
    WHERE id = invitation_record.id;
  END IF;
  
  RETURN NEW;
END;
$$;