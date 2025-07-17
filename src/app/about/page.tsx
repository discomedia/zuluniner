import ContainerLayout from '@/components/layouts/ContainerLayout';

export default function AboutPage() {
  return (
    <ContainerLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p>
            ZuluNiner is a place to list your aircraft and to browse ads. Like planes? So do we. 
            ZuluNiner is built by pilots (well, a pilot and some other guy) for pilots and plane owners. 
            So many other places online to buy and sell planes look like they were built in the 1990s. 
            And they were! We weren&apos;t. We like things to bloody well look good and work.
          </p>
          
          <p>
            That&apos;s all there is to it. List your aircraft, log in to see details and contact someone, 
            and get in touch if you want to. Like it? Buy it! Or don&apos;t! I don&apos;t care!
          </p>
          
          <p>
            If you upload weird stuff or sketchy content, we ban you forever. C&apos;mon guys. 
            Don&apos;t ruin it for everyone else.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">THE TEAM</h2>
          
          <p>
            ZuluNiner was built by Dana Hooshmand and Matt Turzo. Turzo&apos;s a pilot and was the one 
            who came up with the idea (&apos;This will goddamn print money,&apos; he spuriously claimed on a 
            number of occasions), but &apos;founder&apos; is lame, so let&apos;s just call him what he is: Pilot. 
            Dana&apos;s the Co-Pilot. Now, this may seem unfair as Dana built the whole bloody thing and basically 
            invented the Internet. But he&apos;s not a pilot, so that&apos;s how the cookie crumbles.
          </p>
          
          <p>
            Turzo and Dana have both worked at second- and third-best organisations in various fields, 
            and have degrees from universities that were bloody hard to get through and were prestigious 
            in their own rights, even if you&apos;ve never heard of them. Turzo has an MBA and Dana has an LLB, 
            but don&apos;t ask either of them to business or law for you, unless you have lots of $$$ or are super cool.
          </p>
          
          <p>
            Most importantly, this thing is free... for now. If it gets popular... well, that&apos;s gonna cost you.
          </p>
          
          <p>
            Oh and why &ldquo;ZuluNiner&rdquo;? Why not? It sounded fun at some point. There may have been a reason. Shut up.
          </p>
        </div>
      </div>
    </ContainerLayout>
  );
}