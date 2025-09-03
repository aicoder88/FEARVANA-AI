-- Fearvana AI Backend Schema
-- Database schema for Akshay's AI coaching platform

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  email varchar(255) unique not null,
  name varchar(255) not null,
  avatar_url text,
  company varchar(255),
  title varchar(255),
  industry varchar(255),
  experience_level varchar(20) default 'beginner' check (experience_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  current_challenges text[],
  goals text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_active timestamp with time zone default now()
);

-- Sacred Edge Discovery data
create table public.sacred_edge_discovery (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  primary_fears text[],
  avoided_challenges text[],
  worthy_struggles text[],
  transformation_goals text[],
  discovery_session jsonb, -- Store full discovery session data
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AI Coaching Products
create table public.products (
  id varchar(100) primary key,
  name varchar(255) not null,
  description text not null,
  long_description text,
  category varchar(20) not null check (category in ('individual', 'corporate')),
  level varchar(20) not null check (level in ('basic', 'advanced', 'enterprise')),
  status varchar(20) default 'active' check (status in ('active', 'coming_soon', 'discontinued')),
  pricing jsonb not null, -- Store pricing structure
  features text[] not null,
  target_audience text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User Subscriptions
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  product_id varchar(100) references public.products(id),
  stripe_subscription_id varchar(255) unique,
  tier varchar(20) not null check (tier in ('basic', 'advanced', 'enterprise')),
  status varchar(20) not null check (status in ('active', 'cancelled', 'past_due', 'trial', 'incomplete')),
  billing_interval varchar(20) not null check (billing_interval in ('monthly', 'annual')),
  amount integer not null, -- amount in cents
  currency varchar(3) default 'usd',
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Usage tracking
create table public.subscription_usage (
  id uuid default uuid_generate_v4() primary key,
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  ai_chat_messages integer default 0,
  ai_chat_limit integer not null,
  expedition_insights integer default 0,
  expedition_insights_limit integer not null,
  assessments_completed integer default 0,
  assessments_limit integer not null,
  reset_date timestamp with time zone default (now() + interval '1 month'),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AI Chat sessions and messages
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  title varchar(255),
  session_type varchar(50) default 'general' check (session_type in ('general', 'antarctica', 'sacred_edge', 'corporate')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role varchar(20) not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb, -- Store additional data like expedition focus, token usage, etc.
  created_at timestamp with time zone default now()
);

-- Antarctica expedition content and insights
create table public.expedition_logs (
  id uuid default uuid_generate_v4() primary key,
  day integer not null,
  title varchar(255) not null,
  content text not null,
  mental_state varchar(255),
  physical_challenges text[],
  lesson_learned text,
  audio_transcript text,
  location_data jsonb,
  weather_data jsonb,
  created_at timestamp with time zone default now()
);

-- Psychology principles and frameworks
create table public.psychology_principles (
  id uuid default uuid_generate_v4() primary key,
  principle varchar(255) not null,
  description text not null,
  application text not null,
  category varchar(100),
  examples text[],
  created_at timestamp with time zone default now()
);

-- Corporate programs and clients
create table public.corporate_programs (
  id uuid default uuid_generate_v4() primary key,
  program_id varchar(100) not null,
  company_name varchar(255) not null,
  contact_name varchar(255) not null,
  contact_email varchar(255) not null,
  employee_count integer not null,
  industry varchar(255),
  current_challenges text[],
  desired_outcomes text[],
  budget integer,
  status varchar(20) default 'inquiry' check (status in ('inquiry', 'quoted', 'signed', 'active', 'completed', 'cancelled')),
  quote_data jsonb,
  contract_data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Payment methods and transactions
create table public.payment_methods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  stripe_payment_method_id varchar(255) not null,
  type varchar(20) not null check (type in ('card', 'bank_account')),
  card_data jsonb, -- Store card brand, last4, exp_month, exp_year
  bank_data jsonb, -- Store bank name, last4, account_type
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.payment_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  stripe_payment_intent_id varchar(255) unique,
  amount integer not null,
  currency varchar(3) default 'usd',
  status varchar(20) not null check (status in ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Analytics and tracking
create table public.user_analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  session_id uuid, -- Optional browser session tracking
  event_name varchar(100) not null,
  event_data jsonb,
  page_url text,
  user_agent text,
  ip_address inet,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_users_email on public.users(email);
create index idx_users_last_active on public.users(last_active);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_chat_messages_session_id on public.chat_messages(session_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);
create index idx_corporate_programs_status on public.corporate_programs(status);
create index idx_payment_transactions_user_id on public.payment_transactions(user_id);
create index idx_user_analytics_user_id on public.user_analytics(user_id);
create index idx_user_analytics_event_name on public.user_analytics(event_name);
create index idx_user_analytics_created_at on public.user_analytics(created_at);

-- Row Level Security (RLS) policies
alter table public.users enable row level security;
alter table public.sacred_edge_discovery enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_usage enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.user_analytics enable row level security;

-- Basic RLS policies (users can only see their own data)
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view their own sacred edge data" on public.sacred_edge_discovery for all using (auth.uid() = user_id);

create policy "Users can view their own subscriptions" on public.subscriptions for all using (auth.uid() = user_id);

create policy "Users can view their own usage" on public.subscription_usage for select using (
  auth.uid() = (select user_id from public.subscriptions where id = subscription_id)
);

create policy "Users can view their own chat sessions" on public.chat_sessions for all using (auth.uid() = user_id);

create policy "Users can view their own chat messages" on public.chat_messages for all using (auth.uid() = user_id);

create policy "Users can view their own payment methods" on public.payment_methods for all using (auth.uid() = user_id);

create policy "Users can view their own transactions" on public.payment_transactions for select using (auth.uid() = user_id);

-- Public tables (no RLS needed)
-- products, expedition_logs, psychology_principles are public read-only

-- Insert sample data
insert into public.products (id, name, description, long_description, category, level, status, pricing, features, target_audience) values
('fearvana-ai-coach', 'Fearvana AI Coach', 'The World''s First AI Coach Trained by a Marine Who Survived War, Addiction, and 500 Miles Alone in Antarctica', 'Transform ALL of Akshay''s content (podcasts, book, expedition logs, keynotes) into a hyper-intelligent AI coach that delivers personalized "Fearvana transformations."', 'individual', 'basic', 'active', 
 '{"monthly": 97, "annual": 970}',
 '{"AI trained on Antarctic expedition audio logs", "Complete Fearvana book methodology", "Military combat psychology training", "Real-time worthy struggle identification", "Personalized fear transformation coaching", "24/7 AI coach availability"}',
 '{"High-performing entrepreneurs", "Corporate executives", "Military veterans", "Extreme athletes"}'
),
('fearvana-ai-coach-advanced', 'Fearvana AI Coach Advanced', 'Premium AI coaching with live expedition wisdom and priority support', 'Advanced version includes real-time expedition updates, priority AI responses, and access to exclusive content from ongoing adventures.', 'individual', 'advanced', 'active',
 '{"monthly": 297, "annual": 2970}',
 '{"Everything in Basic plan", "Live expedition wisdom updates", "Priority AI response times", "Exclusive adventure content", "Direct messaging capability", "Advanced fear assessment tools"}',
 '{"Fortune 500 executives", "Serious personal development seekers", "Leadership teams"}'
),
('antarctica-insights-ai', 'Antarctica Insights AI', 'Expedition Wisdom Engine - Ask the Antarctica Explorer', 'Real-time decision making under extreme duress from 60 days alone in the most hostile environment on Earth.', 'individual', 'basic', 'active',
 '{"monthly": 67}',
 '{"All expedition audio logs", "Real-time Antarctic decision making", "Daily battle documentation", "Equipment failure responses", "Mental/physical/spiritual struggles", "Survival wisdom database"}',
 '{"Adventure seekers", "Extreme performers", "Crisis managers", "Resilience builders"}'
),
('corporate-fear-extinction', 'Corporate Fear Extinction Program', 'AI-Powered Workshop Series for Fortune 500 teams', 'Scale Akshay''s $25K+ corporate keynotes into comprehensive AI-powered transformation programs.', 'corporate', 'enterprise', 'active',
 '{"monthly": 25000}',
 '{"Pre-workshop fear profile assessment", "Personalized worthy struggle identification", "90-day post-workshop AI coaching", "Real-time performance tracking", "Neuroscience-based protocols", "40% performance improvement guarantee"}',
 '{"Fortune 500 companies", "Corporate leadership teams", "Executive development programs", "High-performance teams"}'
);

-- Insert sample expedition logs
insert into public.expedition_logs (day, title, content, mental_state, physical_challenges, lesson_learned) values
(1, 'The Journey Begins', 'First steps onto the Antarctic ice. The cold hits like a physical force, but this is what I''ve trained for. Every breath is a reminder that I''m pushing the absolute edge of human endurance.', 'Excited, nervous, focused', '{"Extreme cold (-40F)", "Heavy gear weight", "Altitude adjustment"}', 'Preparation meets reality - no amount of training fully prepares you for the actual experience'),
(15, 'Equipment Failure Crisis', 'My primary stove failed this morning. In Antarctica, this could be a death sentence. But fear transforms into focus. I systematically troubleshoot, repair, and create backup systems. This is the Sacred Edge in action.', 'Initially panicked, then laser-focused', '{"Equipment repair in extreme cold", "Fuel conservation", "Time pressure"}', 'Crisis reveals character. When survival is at stake, fear becomes your greatest ally if you transform it into focused action'),
(30, 'The Mental Battle', 'Halfway point. The physical challenges are manageable now, but the mental game is everything. Loneliness, self-doubt, and the vastness of this place test every psychological tool I''ve developed.', 'Introspective, wrestling with doubt, finding inner strength', '{"Muscle fatigue", "Skin damage", "Sleep deprivation"}', 'The real expedition is internal. External challenges are just the catalyst for inner transformation'),
(45, 'Weather Disaster', 'Caught in a whiteout storm that lasted 18 hours. Visibility zero, winds at 60mph, temperature -50F. Had to dig emergency shelter and wait it out.', 'Calm in crisis, hyper-aware, grateful for preparation', '{"Hypothermia risk", "Shelter construction", "Energy conservation"}', 'When you can''t control external conditions, your only power is your response. Panic kills, preparation saves lives'),
(60, 'Emergency Evacuation', 'Medical situation requires immediate evacuation. 500 miles completed alone on Antarctic ice. The journey ends differently than planned, but the transformation is complete.', 'Disappointed but transformed, grateful, wiser', '{"Medical emergency", "Evacuation logistics", "Physical exhaustion"}', 'Success isn''t always reaching the planned destination. Sometimes the real victory is in becoming who you needed to become along the way');

-- Insert psychology principles
insert into public.psychology_principles (principle, description, application, category) values
('Fear as Fuel', 'Transform fear from a paralyzing force into rocket fuel for extraordinary action', 'When facing any challenge, ask: "How can this fear serve me?" rather than "How do I eliminate this fear?"', 'Core Framework'),
('Sacred Edge Discovery', 'Find the intersection of fear and excitement - this is where real growth happens', 'Regularly identify what you''re avoiding that could change everything if you faced it', 'Assessment'),
('Worthy Struggle Selection', 'Not all suffering is equal. Choose struggles that align with your deepest values and highest potential', 'Before taking on any challenge, ask: "Will this struggle make me who I need to become?"', 'Decision Making'),
('Equipment Failure Mindset', 'Plan for things to go wrong, because they will. Your response to failure defines you', 'Always have backup plans and backup plans for your backup plans', 'Risk Management');

-- Functions for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at before update on public.users for each row execute procedure public.handle_updated_at();
create trigger handle_sacred_edge_updated_at before update on public.sacred_edge_discovery for each row execute procedure public.handle_updated_at();
create trigger handle_products_updated_at before update on public.products for each row execute procedure public.handle_updated_at();
create trigger handle_subscriptions_updated_at before update on public.subscriptions for each row execute procedure public.handle_updated_at();
create trigger handle_subscription_usage_updated_at before update on public.subscription_usage for each row execute procedure public.handle_updated_at();
create trigger handle_chat_sessions_updated_at before update on public.chat_sessions for each row execute procedure public.handle_updated_at();
create trigger handle_corporate_programs_updated_at before update on public.corporate_programs for each row execute procedure public.handle_updated_at();
create trigger handle_payment_methods_updated_at before update on public.payment_methods for each row execute procedure public.handle_updated_at();
create trigger handle_payment_transactions_updated_at before update on public.payment_transactions for each row execute procedure public.handle_updated_at();